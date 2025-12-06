# User Acceptance Testing (UAT) - Knowledge Hub

## Deskripsi Aplikasi
Knowledge Hub adalah aplikasi manajemen pengetahuan berbasis Laravel + React yang mengintegrasikan data dari Apache JIRA dengan kemampuan AI untuk analisis dan rekomendasi library/method. Aplikasi ini menggunakan ChromaDB untuk vector embedding dan OpenAI untuk semantic search guna memberikan saran library yang relevan berdasarkan konteks issue/feature.

## Teknologi Stack
- **Backend**: Laravel 12, PHP 8.2
- **Frontend**: React 19, Inertia.js, TypeScript, TailwindCSS
- **Database**: MySQL/MariaDB
- **Vector Database**: ChromaDB
- **AI/ML**: OpenAI (Embeddings & Chat), Sentence Transformers
- **Authentication**: Laravel Fortify (with 2FA)
- **Queue**: Laravel Queue

---

## 1. MODUL AUTENTIKASI & KEAMANAN

### 1.1 Login & Registrasi
- [ ] **Login dengan Email dan Password**
  - Input email dan password yang valid
  - Verifikasi redirect ke dashboard setelah login sukses
  - Verifikasi error message untuk kredensial yang salah
  - Verifikasi session tetap aktif setelah refresh

- [ ] **Two-Factor Authentication (2FA)**
  - Aktifkan 2FA di halaman settings
  - Scan QR code dengan authenticator app
  - Verifikasi login meminta kode 2FA setelah diaktifkan
  - Verifikasi recovery codes dapat diunduh
  - Test login dengan kode 2FA yang benar dan salah
  - Test disable 2FA

- [ ] **Logout**
  - Verifikasi logout menghapus session
  - Verifikasi redirect ke halaman login setelah logout
  - Verifikasi tidak bisa akses halaman protected setelah logout

### 1.2 Password Management
- [ ] **Ubah Password**
  - Akses halaman settings/password
  - Input password lama, password baru, dan konfirmasi
  - Verifikasi validasi: password lama benar, password baru memenuhi requirement
  - Verifikasi password berhasil diubah dan bisa login dengan password baru

- [ ] **Forgot Password** (jika diaktifkan)
  - Request reset password link
  - Verifikasi email reset password diterima
  - Klik link dan set password baru
  - Login dengan password baru

### 1.3 Profile Management
- [ ] **Update Profile**
  - Edit nama dan email di settings/profile
  - Verifikasi perubahan tersimpan
  - Verifikasi email verification jika email diubah

- [ ] **Delete Account** (jika diaktifkan)
  - Verifikasi konfirmasi sebelum delete
  - Verifikasi akun terhapus dari database

---

## 2. MODUL DASHBOARD

### 2.1 Statistik Overview
- [ ] **Kartu Statistik**
  - Verifikasi tampilan total features
  - Verifikasi tampilan total issues
  - Verifikasi tampilan total libraries
  - Verifikasi tampilan total projects
  - Verifikasi angka sesuai dengan data di database

### 2.2 Chart & Visualisasi
- [ ] **Chart Issues by Project**
  - Verifikasi chart menampilkan data per project
  - Verifikasi 3 kategori: all issues, vectorized issues, issues with library
  - Verifikasi tooltip menampilkan detail saat hover
  - Verifikasi data sesuai dengan database

- [ ] **Chart Libraries**
  - Verifikasi chart menampilkan library dengan/tanpa deskripsi
  - Verifikasi proporsi data benar

- [ ] **Chart Issues by Status**
  - Verifikasi semua status ditampilkan
  - Verifikasi jumlah per status benar
  - Verifikasi warna chart sesuai status category

- [ ] **Chart Features by Status**
  - Verifikasi data features per status
  - Verifikasi konsistensi dengan data issues

- [ ] **Chart Issues by Priority**
  - Verifikasi semua priority level ditampilkan
  - Verifikasi sorting berdasarkan jumlah

- [ ] **Chart Top Libraries**
  - Verifikasi menampilkan 10 library teratas
  - Verifikasi sorting berdasarkan usage count
  - Verifikasi jumlah usage benar

### 2.3 Performance
- [ ] **Caching**
  - Verifikasi dashboard loading cepat (< 2 detik)
  - Verifikasi data di-cache selama 5 menit
  - Verifikasi cache invalidation setelah data berubah

---

## 3. MODUL FEATURES

### 3.1 Daftar Features
- [ ] **View Features List**
  - Verifikasi tampilan tabel dengan kolom: Key, Summary, Project, Issue Type, Priority, Status, Reporter
  - Verifikasi pagination berfungsi (10, 25, 50 items per page)
  - Verifikasi avatar/icon untuk project, priority, status tampil

- [ ] **Search Features**
  - Search by key (contoh: FEAT-1)
  - Search by summary
  - Search by description
  - Search by components
  - Verifikasi hasil search akurat dan real-time

- [ ] **Filter Features**
  - Filter by project (multi-select)
  - Filter by issue type (multi-select)
  - Filter by priority (multi-select)
  - Filter by status (multi-select)
  - Filter by reporter (multi-select)
  - Verifikasi kombinasi multiple filters
  - Verifikasi filter "Has Method" (features dengan library)

### 3.2 Create & Edit Feature
- [ ] **Create New Feature**
  - Klik tombol "Add Feature"
  - Verifikasi form sheet terbuka
  - Verifikasi auto-generate Feature Key (FEAT-xxx)
  - Input semua field required:
    - Summary (text)
    - Description (textarea)
    - Components (textarea)
    - Project (combobox dengan search)
    - Issue Type (combobox)
    - Priority (combobox)
    - Status (combobox)
    - Reporter (combobox dengan search)
  - Verifikasi validasi untuk field required
  - Submit dan verifikasi feature tersimpan
  - Verifikasi redirect atau refresh data

- [ ] **Edit Feature**
  - Klik edit pada feature di tabel
  - Verifikasi form ter-populate dengan data existing
  - Edit beberapa field
  - Submit dan verifikasi perubahan tersimpan
  - Verifikasi updated_at berubah

- [ ] **Delete Feature**
  - Klik delete pada feature
  - Verifikasi konfirmasi dialog muncul
  - Confirm delete
  - Verifikasi soft delete (data tidak benar-benar terhapus)
  - Verifikasi feature tidak tampil di list

### 3.3 Detail Feature
- [ ] **View Feature Detail**
  - Klik pada feature key di list
  - Verifikasi breadcrumb navigation
  - Verifikasi informasi detail ditampilkan:
    - Key, Summary, Description
    - Project, Issue Type, Priority, Status, Reporter (dengan avatar/icon)
    - Components
    - Created date
  - Verifikasi format tanggal readable

- [ ] **Feature Libraries**
  - Verifikasi daftar library/method yang terkait
  - Verifikasi badge "Used in X issues"
  - Verifikasi badge "Distance" (similarity score)
  - Verifikasi link ke library detail

- [ ] **Feature Graph Visualization**
  - Verifikasi graph menampilkan relasi feature dengan methods
  - Klik tombol "Maximize" untuk full screen
  - Verifikasi graph interactive (zoom, pan, drag)
  - Close dialog dan verifikasi kembali normal

### 3.4 Feature Suggestions (AI-Powered)
- [ ] **View Suggestions**
  - Scroll ke section "Suggestions" di detail page
  - Verifikasi loading state saat fetch suggestions
  - Verifikasi suggestion graph muncul
  - Verifikasi parameter "Across Projects" (toggle)

- [ ] **Test Suggestion Logic**
  - Test dengan "Across Projects" = false
    - Verifikasi hanya suggest dari project yang sama
  - Test dengan "Across Projects" = true
    - Verifikasi suggest dari semua project
  - Verifikasi similarity score/distance ditampilkan
  - Verifikasi suggestion relevant dengan context

- [ ] **Maximize Suggestion Graph**
  - Klik maximize pada suggestion graph
  - Verifikasi full screen mode
  - Verifikasi dapat view multiple suggested features
  - Close dan verifikasi kembali normal

### 3.5 Feature Graph Export
- [ ] **All Graphs Endpoint**
  - Akses endpoint /features/all-graphs
  - Verifikasi response JSON berisi semua features dengan graph data
  - Verifikasi pagination berfungsi
  - Verifikasi structure data sesuai format

---

## 4. MODUL ISSUES

### 4.1 Daftar Issues
- [ ] **View Issues List**
  - Verifikasi tampilan tabel dengan kolom: Key, Summary, Project, Issue Type, Priority, Status, Reporter
  - Verifikasi default filter "Has Method" = true (hanya issues dengan library)
  - Verifikasi pagination berfungsi

- [ ] **Search Issues**
  - Search by key (contoh: SPARK-12345)
  - Search by summary
  - Search by description
  - Search by components
  - Verifikasi hasil search akurat

- [ ] **Filter Issues**
  - Filter by project (multi-select)
  - Filter by issue type (multi-select)
  - Filter by priority (multi-select)
  - Filter by status (multi-select)
  - Filter by reporter (multi-select)
  - Toggle "Has Method" filter
  - Verifikasi kombinasi multiple filters

### 4.2 Detail Issue
- [ ] **View Issue Detail**
  - Klik pada issue key di list
  - Verifikasi breadcrumb navigation
  - Verifikasi informasi detail ditampilkan:
    - Key, Summary, Description
    - Project, Issue Type, Priority, Status, Reporter
    - Components
    - Created date
    - External URL (link ke Apache JIRA)

- [ ] **Issue Libraries**
  - Verifikasi daftar library/method yang digunakan
  - Verifikasi link library menuju detail

- [ ] **Issue Graph Visualization**
  - Verifikasi graph menampilkan relasi issue dengan methods
  - Klik tombol "Maximize" untuk full screen
  - Verifikasi graph interactive

### 4.3 Issue Graph Export
- [ ] **All Graphs Endpoint**
  - Akses endpoint /issues/all-graphs
  - Verifikasi response JSON berisi semua issues dengan graph data
  - Verifikasi pagination berfungsi

---

## 5. MODUL LIBRARIES

### 5.1 Daftar Libraries
- [ ] **View Libraries List**
  - Verifikasi tampilan tabel dengan kolom: Name, Description, Issues Count
  - Verifikasi pagination berfungsi
  - Verifikasi sorting by issues count (descending)

- [ ] **Search Libraries**
  - Search by name (contoh: org.apache.spark)
  - Search by description
  - Verifikasi hasil search akurat

### 5.2 Create & Edit Library
- [ ] **Create New Library**
  - Klik tombol "Add Library"
  - Input name (required)
  - Input URL (optional)
  - Input description (optional)
  - Submit dan verifikasi tersimpan
  - Verifikasi tidak bisa create duplicate name

- [ ] **Edit Library**
  - Klik edit pada library di tabel
  - Edit URL atau description
  - Submit dan verifikasi perubahan tersimpan

- [ ] **Delete Library**
  - Klik delete pada library
  - Verifikasi konfirmasi dialog
  - Confirm delete
  - Verifikasi soft delete
  - Verifikasi library tidak tampil di list

### 5.3 Library Usage Statistics
- [ ] **Issues Count**
  - Verifikasi kolom "Issues Count" menampilkan jumlah usage yang benar
  - Klik pada library yang memiliki issues
  - Verifikasi dapat melihat daftar issues yang menggunakan library tersebut (jika ada view detail)

---

## 6. MODUL MASTER DATA

### 6.1 Master Projects
- [ ] **View Projects**
  - Akses halaman Master > Projects
  - Verifikasi list projects dari Apache JIRA
  - Verifikasi avatar/icon tampil
  - Verifikasi pagination dan search

- [ ] **Create/Edit Project** (jika diizinkan)
  - Test CRUD operations
  - Verifikasi validasi

### 6.2 Master Issue Types
- [ ] **View Issue Types**
  - Akses halaman Master > Issue Types
  - Verifikasi list issue types
  - Verifikasi icon tampil
  - Verifikasi pagination dan search

- [ ] **Create/Edit Issue Type** (jika diizinkan)
  - Test CRUD operations
  - Verifikasi validasi

### 6.3 Master Priorities
- [ ] **View Priorities**
  - Akses halaman Master > Priorities
  - Verifikasi list priorities
  - Verifikasi icon tampil
  - Verifikasi sorting (order by priority level)

- [ ] **Create/Edit Priority** (jika diizinkan)
  - Test CRUD operations
  - Verifikasi validasi

### 6.4 Master Statuses
- [ ] **View Statuses**
  - Akses halaman Master > Statuses
  - Verifikasi list statuses dengan status category
  - Verifikasi icon dan color tampil
  - Verifikasi grouping by status category

- [ ] **Create/Edit Status** (jika diizinkan)
  - Test CRUD operations
  - Verifikasi validasi

### 6.5 Master Reporters
- [ ] **View Reporters**
  - Akses halaman Master > Reporters
  - Verifikasi list reporters/users
  - Verifikasi avatar tampil
  - Verifikasi display name, email, timezone
  - Verifikasi status active/inactive

- [ ] **Create/Edit Reporter** (jika diizinkan)
  - Test CRUD operations
  - Verifikasi validasi

---

## 7. MODUL AI & VECTOR SEARCH

### 7.1 ChromaDB Integration
- [ ] **Issue Vectorization**
  - Run command: `php artisan issue:chroma`
  - Verifikasi issues di-embed ke ChromaDB
  - Verifikasi progress bar dan logging
  - Verifikasi flag `chromadb_stored` di database ter-update
  - Verifikasi chunking untuk description panjang (> 16384 chars)
  - Verifikasi metadata tersimpan (project, issue_type, priority, status, reporter)

- [ ] **Check Vectorized Issues**
  - Verifikasi di dashboard: chart "Vectorized Issues"
  - Verifikasi count sesuai dengan database
  - Query ChromaDB collection dan verifikasi data tersimpan

### 7.2 Similarity Search
- [ ] **Feature Suggestion dengan ChromaDB**
  - Buka detail feature
  - Verifikasi suggestion section melakukan query ke ChromaDB
  - Verifikasi hasil suggestion relevant (based on semantic similarity)
  - Verifikasi similarity score ditampilkan
  - Test dengan berbagai feature (simple vs complex description)

- [ ] **Cross-Project Suggestions**
  - Toggle "Across Projects" ON
  - Verifikasi suggestion dari berbagai project
  - Toggle OFF
  - Verifikasi suggestion hanya dari project yang sama

### 7.3 OpenAI Integration
- [ ] **Embedding Generation**
  - Verifikasi embedding menggunakan model: text-embedding-3-small
  - Verifikasi dimension: 1536
  - Check logs untuk API calls
  - Verifikasi error handling jika API key invalid

- [ ] **Token Usage & Rate Limiting**
  - Monitor OpenAI usage dashboard
  - Verifikasi tidak ada excessive API calls
  - Test dengan banyak requests dan verifikasi retry logic

---

## 8. MODUL DATA IMPORT & PROCESSING

### 8.1 JIRA Data Import (Python Script)
- [ ] **Process JIRA Files**
  - Run script: `python scripts/process_jira.py`
  - Verifikasi script membaca file JSON dari `storage/app/private/issues`
  - Verifikasi tracking via `processed_jira_files.csv`
  - Verifikasi tidak memproses file yang sudah di-track
  - Verifikasi extracting GitHub PR URLs dari JIRA data

- [ ] **GitHub PR Analysis**
  - Verifikasi script fetch commits dari GitHub PR
  - Verifikasi extracting Java imports dari patch/diff
  - Verifikasi hasil disimpan ke `jira_imports.csv`
  - Verifikasi deduplikasi imports
  - Test dengan berbagai JIRA keys (SPARK, HADOOP, etc.)

- [ ] **Error Handling**
  - Test dengan GitHub token invalid
  - Test dengan JIRA URL tidak accessible
  - Test dengan PR yang tidak ada
  - Verifikasi retry logic untuk rate limiting
  - Verifikasi logging errors ke console

### 8.2 External API Integration
- [ ] **Apache JIRA API**
  - Verifikasi koneksi ke `https://issues.apache.org/jira/rest/api/2`
  - Test search endpoint dengan JQL
  - Verifikasi filter by project, priority, status, etc.
  - Verifikasi pagination (startAt, maxResults)
  - Test error handling untuk API down

- [ ] **GitHub API**
  - Verifikasi authentication dengan GITHUB_TOKEN
  - Test get PR commits
  - Test get commit details
  - Verifikasi rate limiting handling
  - Verifikasi retry strategy

---

## 9. MODUL SETTINGS

### 9.1 Appearance Settings
- [ ] **Theme Toggle**
  - Akses halaman Settings > Appearance
  - Toggle between Light/Dark/System theme
  - Verifikasi perubahan theme langsung apply
  - Verifikasi preference tersimpan di localStorage
  - Refresh page dan verifikasi theme persisted

### 9.2 Profile Settings
- [ ] **Edit Profile**
  - Sudah di-cover di section Autentikasi

### 9.3 Password Settings
- [ ] **Change Password**
  - Sudah di-cover di section Autentikasi

### 9.4 Two-Factor Authentication Settings
- [ ] **2FA Management**
  - Sudah di-cover di section Autentikasi

---

## 10. MODUL NAVIGATION & UI/UX

### 10.1 Navigation Menu
- [ ] **Sidebar Navigation**
  - Verifikasi menu items: Dashboard, Features, Issues, Libraries, Master (with submenu)
  - Verifikasi icon untuk setiap menu
  - Verifikasi active state pada menu yang sedang dibuka
  - Verifikasi submenu Master dapat expand/collapse

- [ ] **Breadcrumb Navigation**
  - Verifikasi breadcrumb tampil di setiap halaman
  - Verifikasi link breadcrumb berfungsi
  - Verifikasi current page tidak clickable

### 10.2 User Interface Components
- [ ] **Forms**
  - Verifikasi form validation (required, min/max length, format)
  - Verifikasi error messages jelas dan helpful
  - Verifikasi form submission dengan loading state
  - Verifikasi success/error toast notification

- [ ] **Data Tables**
  - Verifikasi sorting column (jika ada)
  - Verifikasi pagination controls
  - Verifikasi row per page selector
  - Verifikasi responsive table (mobile view)
  - Verifikasi skeleton loading state

- [ ] **Dialogs & Modals**
  - Verifikasi dialog dapat dibuka/ditutup
  - Verifikasi backdrop click untuk close
  - Verifikasi ESC key untuk close
  - Verifikasi focus trap dalam dialog
  - Verifikasi scroll behavior

- [ ] **Combobox/Select Components**
  - Verifikasi search/filter dalam combobox
  - Verifikasi debounce pada search input
  - Verifikasi pagination pada combobox (load more)
  - Verifikasi keyboard navigation (arrow keys)
  - Verifikasi clear selection

### 10.3 Responsive Design
- [ ] **Mobile Responsiveness**
  - Test di berbagai screen size: 320px, 375px, 768px, 1024px, 1440px
  - Verifikasi sidebar collapse di mobile
  - Verifikasi table scroll horizontal di mobile
  - Verifikasi form layout adjust di mobile
  - Verifikasi touch gestures untuk graph

- [ ] **Browser Compatibility**
  - Test di Chrome (latest)
  - Test di Firefox (latest)
  - Test di Safari (latest)
  - Test di Edge (latest)

---

## 11. MODUL PERFORMANCE & OPTIMIZATION

### 11.1 Performance Testing
- [ ] **Page Load Time**
  - Dashboard < 2 detik
  - Features list < 1.5 detik
  - Issues list < 1.5 detik
  - Detail pages < 1 detik
  - Verifikasi dengan Network throttling (Fast 3G)

- [ ] **API Response Time**
  - GET /features/data < 500ms
  - GET /issues/data < 500ms
  - GET /libraries/data < 500ms
  - POST /features (create) < 1 detik
  - GET /features/{key}/suggestion < 2 detik (AI-powered)

- [ ] **Database Query Optimization**
  - Verifikasi penggunaan eager loading (with)
  - Verifikasi tidak ada N+1 query problem
  - Verifikasi index pada kolom yang sering di-query
  - Check query log dengan `php artisan pail`

- [ ] **Caching Strategy**
  - Verifikasi dashboard cache (5 minutes)
  - Verifikasi query cache untuk dropdown options
  - Verifikasi cache invalidation setelah data change
  - Verifikasi React Query cache (staleTime, gcTime)

### 11.2 Asset Optimization
- [ ] **Frontend Build**
  - Run `npm run build`
  - Verifikasi bundle size reasonable (< 1MB for main chunk)
  - Verifikasi code splitting untuk routes
  - Verifikasi asset compression (gzip/brotli)

- [ ] **Image Optimization**
  - Verifikasi image lazy loading
  - Verifikasi avatar/icon ukuran reasonable
  - Verifikasi format image optimal (WebP/PNG/SVG)

---

## 12. MODUL SECURITY

### 12.1 Authentication Security
- [ ] **Password Security**
  - Verifikasi password hashing (bcrypt/argon2)
  - Verifikasi minimum password length enforced
  - Verifikasi password confirmation match
  - Verifikasi rate limiting untuk login attempts

- [ ] **Session Security**
  - Verifikasi session timeout (idle)
  - Verifikasi CSRF token protection
  - Verifikasi secure cookie flags (HttpOnly, Secure, SameSite)
  - Verifikasi session regeneration setelah login

- [ ] **2FA Security**
  - Verifikasi TOTP algorithm correct
  - Verifikasi recovery codes unique dan hashed
  - Verifikasi backup codes satu kali pakai

### 12.2 Authorization
- [ ] **Middleware Protection**
  - Verifikasi semua routes protected dengan middleware auth
  - Test akses routes tanpa login (redirect ke login)
  - Verifikasi email verification middleware (jika diaktifkan)

- [ ] **API Token Security** (jika ada API endpoints)
  - Verifikasi API token generation
  - Verifikasi token expiration
  - Verifikasi token scope/permissions

### 12.3 Input Validation & Sanitization
- [ ] **XSS Prevention**
  - Test input dengan script tags
  - Verifikasi output di-escape properly
  - Test dengan berbagai XSS payload

- [ ] **SQL Injection Prevention**
  - Verifikasi penggunaan Eloquent/Query Builder (parameterized)
  - Test dengan SQL injection payload di search/filter
  - Verifikasi tidak ada raw query tanpa binding

- [ ] **CSRF Protection**
  - Verifikasi CSRF token ada di setiap form POST/PUT/DELETE
  - Test submit form tanpa CSRF token (should fail)

---

## 13. MODUL ERROR HANDLING & LOGGING

### 13.1 Error Pages
- [ ] **404 Not Found**
  - Akses URL yang tidak ada
  - Verifikasi halaman 404 custom
  - Verifikasi link back to home

- [ ] **500 Server Error**
  - Simulate server error
  - Verifikasi halaman 500 custom
  - Verifikasi error tidak expose stack trace di production

- [ ] **403 Forbidden**
  - Test akses resource tanpa permission
  - Verifikasi halaman 403 custom

### 13.2 Logging
- [ ] **Application Logs**
  - Verifikasi logs tersimpan di `storage/logs/laravel.log`
  - Check log level appropriate (info, warning, error)
  - Verifikasi log rotation

- [ ] **Queue Logs**
  - Verifikasi queue job execution logged
  - Check failed jobs di `failed_jobs` table
  - Verifikasi retry logic untuk failed jobs

- [ ] **API Logs**
  - Verifikasi external API calls logged
  - Check error logs untuk failed API calls
  - Verifikasi tidak log sensitive data (API keys, passwords)

### 13.3 Error Handling
- [ ] **Frontend Error Handling**
  - Test form submission dengan network error
  - Verifikasi error message user-friendly
  - Test API call timeout
  - Verifikasi retry mechanism

- [ ] **Backend Error Handling**
  - Test validation errors
  - Test database connection error
  - Test external API error
  - Verifikasi graceful degradation

---

## 14. MODUL BACKUP & RECOVERY

### 14.1 Database Backup
- [ ] **Manual Backup**
  - Export database dengan `mysqldump` atau GUI tool
  - Verifikasi backup file complete
  - Test restore dari backup

- [ ] **Automated Backup** (jika ada)
  - Verifikasi scheduled backup running
  - Check backup retention policy
  - Verifikasi notification jika backup gagal

### 14.2 Data Recovery
- [ ] **Soft Delete Recovery**
  - Delete feature/library/issue
  - Verifikasi data masih ada di database dengan `deleted_at`
  - Restore data dengan query (jika ada admin interface)
  - Verifikasi data kembali muncul

---

## 15. TESTING KHUSUS FITUR AI

### 15.1 Embedding Quality
- [ ] **Test Similarity Search Accuracy**
  - Create feature dengan description: "Implement user authentication with OAuth2"
  - Verifikasi suggestion menampilkan issues/features terkait authentication
  - Create feature dengan description: "Fix memory leak in data processing pipeline"
  - Verifikasi suggestion menampilkan issues terkait memory/performance
  - Verifikasi similarity score reasonable (> 0.7 untuk high similarity)

### 15.2 Edge Cases
- [ ] **Empty Description**
  - Create feature dengan description kosong
  - Verifikasi suggestion masih berfungsi (gunakan summary)
  - Verifikasi tidak ada error

- [ ] **Very Long Description**
  - Create feature dengan description > 16384 characters
  - Verifikasi chunking berfungsi
  - Verifikasi suggestion tetap accurate

- [ ] **Non-English Description**
  - Create feature dengan description bahasa Indonesia
  - Verifikasi embedding tetap berfungsi
  - Verifikasi suggestion relevan (jika ada data bilingual)

- [ ] **Special Characters**
  - Create feature dengan description mengandung code snippet, special chars
  - Verifikasi tidak ada error
  - Verifikasi suggestion berfungsi

---

## 16. ACCEPTANCE CRITERIA SUMMARY

### Critical Must-Have
- ✅ User dapat login dan logout dengan aman
- ✅ User dapat melihat dashboard dengan statistik akurat
- ✅ User dapat CRUD features dengan validasi yang benar
- ✅ User dapat CRUD issues dan melihat detail
- ✅ User dapat CRUD libraries dan melihat usage statistics
- ✅ User dapat melihat suggestion berbasis AI yang relevant
- ✅ Data vectorization ke ChromaDB berfungsi dengan benar
- ✅ Performance acceptable (page load < 3 detik)
- ✅ Security: No XSS, SQL Injection, CSRF vulnerabilities
- ✅ Error handling yang graceful (no white screen of death)

### Nice to Have
- 🔄 Email notification untuk events penting
- 🔄 Export data ke CSV/Excel
- 🔄 Advanced filtering dan sorting
- 🔄 Batch operations (bulk delete, bulk update)
- 🔄 Activity log/audit trail
- 🔄 API documentation (Swagger/OpenAPI)

---

## 17. UAT SIGN-OFF

### Testing Team
- **Tester Name**: ___________________
- **Date**: ___________________
- **Environment**: [ ] Development [ ] Staging [ ] Production
- **Browser/Device**: ___________________

### Test Results Summary
- Total Test Cases: ___________
- Passed: ___________
- Failed: ___________
- Blocked: ___________
- Not Tested: ___________

### Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Approval
- [ ] All critical test cases passed
- [ ] All critical bugs resolved
- [ ] Performance meets requirements
- [ ] Security requirements met
- [ ] Application ready for production

**Approved by**: ___________________
**Date**: ___________________
**Signature**: ___________________

---

## Notes
- Test di environment yang mirip dengan production
- Gunakan data realistic untuk testing (tidak hanya dummy data)
- Document semua bugs yang ditemukan dengan screenshot dan steps to reproduce
- Prioritas testing: Security > Functionality > Performance > UX
- Lakukan regression testing setelah bug fixes
