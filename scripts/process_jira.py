import csv
import json
import os
import re
import time
from typing import Optional

import requests
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

load_dotenv()

# --- KONFIGURASI ---
# Pastikan Anda mengatur environment variable GITHUB_TOKEN
# export GITHUB_TOKEN="ghp_..."
# GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    print("Error: GITHUB_TOKEN environment variable not set.")
    exit(1)

GITHUB_HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# Regex untuk URL GitHub PR
PR_URL_REGEX = re.compile(r"https://github.com/([^/]+)/([^/]+)/pull/(\d+)")

# Regex untuk mengekstrak import JAVA yang BARU ditambahkan
# Ini mencari baris yang dimulai dengan '+' (added), diikuti 'import',
# dan menangkap nama paket/kelasnya.
JAVA_IMPORT_REGEX = re.compile(r"^\+\s*import\s+([a-zA-Z0-9_.*]+);")


# ---------------------
# Session dengan retry strategy
def create_session_with_retries():
    """Membuat session dengan retry otomatis untuk mengatasi rate limit."""
    session = requests.Session()

    # Konfigurasi retry strategy
    retry_strategy = Retry(
        total=5,  # Maksimal 5 retry
        backoff_factor=2,  # Waktu tunggu: 2, 4, 8, 16, 32 detik
        status_forcelist=[403, 429, 500, 502, 503, 504],  # Status code yang di-retry
        allowed_methods=["GET"],  # Hanya retry untuk GET
        raise_on_status=False
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    return session


# Session global untuk reuse connection
SESSION = create_session_with_retries()

# File CSV untuk tracking proses
PROCESSED_FILES_CSV = './processed_jira_files.csv'
# File CSV untuk menyimpan imports yang ditemukan
IMPORTS_CSV = './jira_imports.csv'
# Directory untuk menyimpan file JIRA issues
ISSUES_DIR = '../storage/app/private/issues'
# ---------------------


def load_processed_files():
    """Membaca daftar file yang sudah diproses dari CSV."""
    processed = set()

    if not os.path.exists(PROCESSED_FILES_CSV):
        return processed

    try:
        with open(PROCESSED_FILES_CSV, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                processed.add(row['filename'])
    except Exception as e:
        print(f"[Warning] Gagal membaca CSV tracking: {e}")

    return processed


def mark_file_as_processed(filename):
    """Menandai file sebagai sudah diproses dengan menambahkan ke CSV."""
    file_exists = os.path.exists(PROCESSED_FILES_CSV)

    try:
        with open(PROCESSED_FILES_CSV, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['filename', 'processed_at'])

            # Tulis header jika file baru
            if not file_exists:
                writer.writeheader()

            # Tulis entry
            writer.writerow({
                'filename': filename,
                'processed_at': time.strftime('%Y-%m-%d %H:%M:%S')
            })
    except Exception as e:
        print(f"[Error] Gagal menulis ke CSV tracking: {e}")


def load_existing_imports():
    """Membaca import yang sudah ada di CSV untuk menghindari duplikasi."""
    existing = set()

    if not os.path.exists(IMPORTS_CSV):
        return existing

    try:
        with open(IMPORTS_CSV, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Buat tuple (jira_key, import) sebagai unique identifier
                existing.add((row['jira_key'], row['import']))
    except Exception as e:
        print(f"[Warning] Gagal membaca CSV imports: {e}")

    return existing


def save_imports_to_csv(jira_key, imports_list):
    """Menyimpan imports ke CSV, menghindari duplikasi."""
    if not imports_list:
        return

    file_exists = os.path.exists(IMPORTS_CSV)

    # Load existing imports untuk cek duplikasi
    existing_imports = load_existing_imports()

    # Filter imports yang belum ada
    new_imports = []
    for imp in imports_list:
        if (jira_key, imp) not in existing_imports:
            new_imports.append(imp)

    if not new_imports:
        print(f"      -> Semua import sudah ada di CSV, tidak ada yang ditambahkan")
        return

    try:
        with open(IMPORTS_CSV, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['jira_key', 'import', 'found_at'])

            # Tulis header jika file baru
            if not file_exists:
                writer.writeheader()

            # Tulis setiap import
            for imp in new_imports:
                writer.writerow({
                    'jira_key': jira_key,
                    'import': imp,
                    'found_at': time.strftime('%Y-%m-%d %H:%M:%S')
                })

        print(f"      -> Berhasil menyimpan {len(new_imports)} import baru ke CSV")
    except Exception as e:
        print(f"[Error] Gagal menulis imports ke CSV: {e}")
# ---------------------


def find_github_pr_urls(jira_data):
    """Mencari semua URL PR GitHub dari seluruh data API Jira (recursive search)."""

    found_urls = []

    def search_recursive(obj, visited=None):
        """Fungsi rekursif untuk mencari URL GitHub PR di semua level data."""
        if visited is None:
            visited = set()

        # Hindari infinite loop untuk object yang sama
        obj_id = id(obj)
        if obj_id in visited:
            return
        visited.add(obj_id)

        # Jika obj adalah string, cek apakah ini URL GitHub PR
        if isinstance(obj, str):
            if "github.com" in obj and "/pull/" in obj:
                # Cari semua URL dalam string (bisa ada beberapa)
                matches = PR_URL_REGEX.findall(obj)
                for match in matches:
                    # Rekonstruksi URL dari groups
                    url = f"https://github.com/{match[0]}/{match[1]}/pull/{match[2]}"
                    if url not in found_urls:
                        found_urls.append(url)

        # Jika obj adalah dict, cari di semua values
        elif isinstance(obj, dict):
            for value in obj.values():
                search_recursive(value, visited)

        # Jika obj adalah list, cari di semua items
        elif isinstance(obj, list):
            for item in obj:
                search_recursive(item, visited)

    search_recursive(jira_data)
    return found_urls


def parse_github_pr_url(url):
    """Mengekstrak owner, repo, dan pull_number dari URL PR."""
    match = PR_URL_REGEX.search(url)
    if match:
        return match.group(1), match.group(2), match.group(3)
    return None, None, None


def get_imports_from_commit(owner, repo, commit_sha):
    """Mengambil detail commit dan mengekstrak import Java baru dari patch."""
    commit_url = f"https://api.github.com/repos/{owner}/{repo}/commits/{commit_sha}"

    try:
        res = SESSION.get(commit_url, timeout=30, headers=GITHUB_HEADERS)
        res.raise_for_status()  # Error jika status 4xx/5xx
        commit_data = res.json()
    except requests.exceptions.RequestException as e:
        print(f"  [Error] Gagal mengambil commit {commit_sha}: {e}")
        return []

    found_imports = []

    for file_info in commit_data.get('files', []):
        filename = file_info.get('filename', '')

        # Hanya proses file Java dan pastikan ada patch
        if filename.endswith('.java') and 'patch' in file_info:
            patch = file_info['patch']

            for line in patch.split('\n'):
                match = JAVA_IMPORT_REGEX.match(line)
                if match:
                    # Ambil grup 1 (nama paket/kelas yang di-import)
                    found_imports.append(match.group(1))

    return list(set(found_imports))  # Kembalikan import unik


def process_github_pr(owner, repo, pull_number, jira_key):
    """Memproses PR: dapatkan semua commit dan cari import dari setiap commit."""
    print(f"  -> Memproses PR: {owner}/{repo}/pull/{pull_number}")
    commits_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/commits"

    try:
        res = SESSION.get(commits_url, timeout=30, headers=GITHUB_HEADERS)
        res.raise_for_status()
        commits_data = res.json()
    except requests.exceptions.RequestException as e:
        print(f"  [Error] Gagal mengambil commit untuk PR {pull_number}: {e}")
        return []

    commit_shas = [commit['sha'] for commit in commits_data]
    print(f"  -> Ditemukan {len(commit_shas)} commit.")

    all_imports_in_pr = []

    for i, sha in enumerate(commit_shas, 1):
        # Beri jeda lebih lama untuk menghindari rate limit
        if i > 1:  # Skip delay untuk commit pertama
            time.sleep(2)

        print(f"    -> Memeriksa commit {sha[:7]} ({i}/{len(commit_shas)})...")
        imports = get_imports_from_commit(owner, repo, sha)

        if imports:
            print(f"      [IMPORTS DITEMUKAN]: {imports}")
            all_imports_in_pr.extend(imports)
        else:
            print(f"      [Tidak ada import Java baru]")

    # Hapus duplikasi dalam PR yang sama
    unique_imports = list(set(all_imports_in_pr))

    # Simpan ke CSV
    if unique_imports:
        save_imports_to_csv(jira_key, unique_imports)

    return unique_imports


def process_jira_file(filename):
    """Fungsi utama untuk memproses satu file JSON Jira."""
    # if 'SPARK' not in filename:
    #     return False

    # Ekstrak JIRA key dari filename (contoh: SPARK-123.json -> SPARK-123)
    jira_key = os.path.splitext(os.path.basename(filename))[0]

    try:
        with open(filename, 'r') as f:
            local_data = json.load(f)
    except Exception as e:
        print(f"[Error] Gagal membaca file {filename}: {e}")
        return False

    jira_self_url = local_data.get('self')
    if not jira_self_url:
        print("[Error] Key 'self' tidak ditemukan di file JSON.")
        return False

    # 1. Panggil API Jira dengan retry dan delay
    max_attempts = 3
    attempt = 0
    jira_api_data = None

    while attempt < max_attempts and jira_api_data is None:
        attempt += 1
        try:
            # Tambahkan delay sebelum request ke Jira
            if attempt > 1:
                wait_time = 5 * attempt  # 10, 15 detik
                print(f"  -> Retry {attempt}/{max_attempts}, menunggu {wait_time} detik...")
                time.sleep(wait_time)
            else:
                time.sleep(1)  # Delay minimal untuk request pertama

            # Kita tidak perlu token untuk Jira Apache (read-only)
            res = SESSION.get(jira_self_url, timeout=30)
            res.raise_for_status()
            jira_api_data = res.json()
        except requests.exceptions.RequestException as e:
            if attempt >= max_attempts:
                print(f"[Error] Gagal mengambil data dari API Jira {jira_self_url}: {e}")
                return False
            else:
                print(f"  -> Attempt {attempt} gagal: {e}")

    # 2. Cari Link PR GitHub
    pr_urls = find_github_pr_urls(jira_api_data)

    if not pr_urls:
        print("  -> [SKIP] Tidak ditemukan link GitHub PR.")
        return True  # Tetap dianggap berhasil diproses

    print(f"  -> Ditemukan {len(pr_urls)} PR GitHub")

    # 3. Proses setiap PR yang ditemukan
    for pr_url in pr_urls:
        print(f"\n  -> PR URL: {pr_url}")

        # Parse URL PR
        owner, repo, pull_number = parse_github_pr_url(pr_url)

        if not owner:
            print(f"  -> [SKIP] URL PR tidak valid: {pr_url}")
            continue

        # Proses PR di GitHub dan simpan imports
        process_github_pr(owner, repo, pull_number, jira_key)

    return True  # Berhasil diproses


# --- FUNGSI UTAMA UNTUK MENJALANKAN ---
def main():
    # Temukan semua file .json di direktori issues, kecuali yang ada di temp
    json_files = []

    for root, dirs, files in os.walk(ISSUES_DIR):
        # Skip direktori temp
        if 'temp' in root.split(os.sep):
            continue

        for file in files:
            if file.endswith('.json'):
                # Simpan path lengkap relatif dari issues_dir
                relative_path = os.path.relpath(os.path.join(root, file), ISSUES_DIR)
                json_files.append(os.path.join(ISSUES_DIR, relative_path))

    if not json_files:
        print("Tidak ditemukan file JSON di direktori ini.")
        return

    # Load daftar file yang sudah diproses
    processed_files = load_processed_files()
    print(f"File yang sudah diproses sebelumnya: {len(processed_files)}")

    # Filter file yang belum diproses
    files_to_process = [f for f in json_files if f not in processed_files]

    print(f"Total file ditemukan: {len(json_files)}")
    print(f"File yang perlu diproses: {len(files_to_process)}")

    if not files_to_process:
        print("Semua file sudah diproses!")
        return

    for idx, jira_file in enumerate(files_to_process, 1):
        print(f"\n{'='*80}")
        print(f"[{idx}/{len(files_to_process)}] Memproses: {os.path.basename(jira_file)}")
        print(f"{'='*80}")

        success = process_jira_file(jira_file)

        if success:
            # Tandai file sebagai sudah diproses
            mark_file_as_processed(jira_file)
            print(f"  ✓ File berhasil diproses dan ditandai di CSV")
        else:
            print(f"  ✗ File gagal diproses, tidak ditandai di CSV")

        # Delay antar file untuk menghindari rate limit
        # if idx < len(files_to_process):
        #     time.sleep(3)

    print(f"\n{'='*80}")
    print(f"SELESAI! Total file diproses: {idx}")
    print(f"{'='*80}")


if __name__ == "__main__":
    main()
