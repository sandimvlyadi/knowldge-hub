# Knowledge Hub

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat&logo=php&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)

Knowledge Hub adalah aplikasi manajemen pengetahuan berbasis Laravel + React yang mengintegrasikan data dari Apache JIRA dengan kemampuan AI untuk analisis dan rekomendasi library/method. Aplikasi ini menggunakan ChromaDB untuk vector embedding dan OpenAI untuk semantic search guna memberikan saran library yang relevan berdasarkan konteks issue/feature.

## 🚀 Fitur Utama

### 📊 Dashboard & Analytics
- **Statistik Real-time**: Monitoring total features, issues, libraries, dan projects
- **Visualisasi Data**: Chart interaktif untuk analisis:
  - Issues by Project (dengan status vektorisasi)
  - Libraries usage dan deskripsi
  - Issues/Features by Status
  - Issues by Priority
  - Top 10 Libraries terpopuler

### 🎯 Manajemen Features
- CRUD operations untuk features/epics dari JIRA
- Tracking status dan prioritas features
- Visualisasi graph dependencies
- AI-powered library suggestion berdasarkan konteks feature
- Auto-generate unique feature keys

### 🐛 Manajemen Issues
- Import otomatis dari JIRA
- Vector embedding untuk semantic search
- Linking issues dengan libraries yang digunakan
- Filter berdasarkan project, status, priority
- Detail view dengan informasi lengkap

### 📚 Manajemen Libraries
- Katalog library/framework yang digunakan
- Tracking usage count per library
- URL dokumentasi dan deskripsi
- Relationship dengan issues yang menggunakan library

### 🤖 AI-Powered Features
- **Semantic Search**: Pencarian berbasis konteks menggunakan ChromaDB
- **Library Recommendation**: Saran library yang relevan berdasarkan deskripsi feature/issue
- **Auto Vectorization**: Otomatis convert issue descriptions menjadi embeddings
- **Context-Aware Suggestions**: Analisis menggunakan OpenAI GPT untuk rekomendasi

### 🔐 Authentication & Security
- Login dengan email dan password (Laravel Fortify)
- Two-Factor Authentication (2FA) dengan QR code
- Recovery codes untuk 2FA
- Profile management
- Password change dengan validasi
- Session management

### 🎨 User Interface
- Modern UI dengan TailwindCSS
- Dark/Light mode support
- Responsive design
- Component-based architecture dengan Radix UI
- Interactive charts dan visualisasi
- Real-time data updates

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: SQLite (development) / MySQL/MariaDB (production)
- **Queue System**: Laravel Queue dengan database driver
- **Authentication**: Laravel Fortify
- **API Integration**: OpenAI API

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Routing**: Inertia.js 2.0
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI, Headless UI
- **Forms**: React Hook Form dengan Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **Build Tool**: Vite

### AI & Vector Database
- **Vector DB**: ChromaDB (hosted/cloud)
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **LLM**: OpenAI GPT models untuk analisis dan rekomendasi

### Development Tools
- **Testing**: Pest PHP (unit & feature tests)
- **Code Quality**: Laravel Pint, ESLint, Prettier
- **Type Checking**: TypeScript
- **Logging**: Laravel Pail

## 📋 Prerequisites

- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 18+ dan npm/pnpm/yarn
- SQLite extension untuk PHP (development)
- OpenAI API key
- ChromaDB account (cloud) atau ChromaDB server (self-hosted)

## 🔧 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd knowledge-hub
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite
```

### 4. Configure Environment Variables

Edit file `.env` dan sesuaikan konfigurasi berikut:

```env
# Application
APP_NAME="Knowledge Hub"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite untuk development)
DB_CONNECTION=sqlite

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION=your_openai_org_id
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536

# ChromaDB Configuration
CHROMADB_HOST=https://api.trychroma.com
CHROMADB_PORT=8000
CHROMADB_TOKEN=your_chromadb_token
CHROMADB_TENANT=your_tenant_id
CHROMADB_DATABASE=knowledge-hub
CHROMADB_EMBEDDING_PROVIDER=openai

# Queue Configuration
QUEUE_CONNECTION=database

# Session
SESSION_DRIVER=database
```

### 5. Database Migration

```bash
# Run migrations
php artisan migrate

# (Optional) Seed database dengan data sample
php artisan db:seed
```

### 6. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

## 🚀 Quick Start

### Using Composer Scripts (Recommended)

```bash
# Setup lengkap (install, migrate, build)
composer setup

# Development mode (run server + queue + logs + vite)
composer dev

# Development dengan SSR
composer dev:ssr
```

### Manual Start

```bash
# Terminal 1: Laravel development server
php artisan serve

# Terminal 2: Queue worker
php artisan queue:listen --tries=1

# Terminal 3: Vite dev server
npm run dev

# Terminal 4: Logs (optional)
php artisan pail --timeout=0
```

Aplikasi akan berjalan di `http://localhost:8000`

## 📚 Python Scripts untuk JIRA Integration

Aplikasi dilengkapi dengan Python script untuk import data dari JIRA dan GitHub:

### Setup Python Environment

```bash
cd scripts

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create `.env` file di folder `scripts/`:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

### Running Scripts

```bash
# Process JIRA exports dan extract imports dari GitHub PR
python process_jira.py
```

Script ini akan:
1. Membaca file JSON dari export JIRA
2. Extract URL GitHub PR dari issue descriptions
3. Fetch diff dari PR untuk menemukan imports yang ditambahkan
4. Menyimpan hasil ke CSV files
5. Track progress untuk resume jika terjadi error

## 🧪 Testing

```bash
# Run all tests
composer test

# atau
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run tests dengan coverage
php artisan test --coverage
```

## 📝 Code Quality

```bash
# PHP Code Formatting (Laravel Pint)
./vendor/bin/pint

# JavaScript/TypeScript Linting
npm run lint

# Format code (Prettier)
npm run format

# Type checking
npm run types
```

## 📖 API Routes

### Public Routes
- `GET /` - Redirect ke dashboard
- `GET /login` - Login page
- `POST /login` - Login handler
- `POST /logout` - Logout handler

### Protected Routes (Requires Authentication)
- `GET /dashboard` - Dashboard dengan statistik dan charts

#### Features
- `GET /features` - List features
- `GET /features/data` - Data API untuk table
- `GET /features/all-graphs` - Graph data untuk visualisasi
- `GET /features/generate-key` - Generate unique feature key
- `GET /features/{key}` - Detail feature
- `GET /features/{key}/suggestion` - AI library suggestions
- `POST /features` - Create feature
- `PUT /features/{id}` - Update feature
- `DELETE /features/{id}` - Delete feature

#### Issues
- `GET /issues` - List issues
- `GET /issues/data` - Data API untuk table
- `GET /issues/all-graphs` - Graph data untuk visualisasi
- `GET /issues/{key}` - Detail issue

#### Libraries
- `GET /libraries` - List libraries
- `GET /libraries/data` - Data API untuk table
- `GET /libraries/option` - Options untuk dropdown
- `POST /libraries` - Create library
- `PUT /libraries/{id}` - Update library
- `DELETE /libraries/{id}` - Delete library

#### Master Data
- Project, Issue Type, Priority, Status, Reporter endpoints
- Format: `GET /master/{resource}/data` dan `GET /master/{resource}/option`

#### Settings
- `GET /settings/profile` - Profile settings
- `PATCH /settings/profile` - Update profile
- `DELETE /settings/profile` - Delete account
- `GET /settings/password` - Password change page
- `PUT /settings/password` - Update password
- `GET /settings/appearance` - Appearance settings
- `GET /settings/two-factor` - 2FA setup page

## 🔄 Queue Jobs

Aplikasi menggunakan queue untuk background processing:

- **StoreIssues Event**: Triggered saat import issues dari JIRA
- **ProcessStoreIssues Listener**: Process dan store issues ke database + ChromaDB

Jalankan queue worker:

```bash
php artisan queue:listen --tries=1
```

## 📦 Project Structure

```
knowledge-hub/
├── app/
│   ├── Console/Commands/       # Artisan commands
│   ├── Events/                 # Event classes
│   ├── Helpers/                # Helper functions
│   ├── Http/
│   │   ├── Controllers/        # Request handlers
│   │   ├── Middleware/         # HTTP middleware
│   │   └── Requests/           # Form request validation
│   ├── Listeners/              # Event listeners
│   ├── Models/                 # Eloquent models
│   └── Providers/              # Service providers
├── config/                     # Configuration files
├── database/
│   ├── migrations/             # Database migrations
│   └── seeders/                # Database seeders
├── resources/
│   ├── css/                    # CSS files
│   ├── js/                     # React/TypeScript code
│   │   ├── actions/            # API actions (Wayfinder)
│   │   ├── components/         # React components
│   │   ├── layouts/            # Layout components
│   │   ├── pages/              # Page components (Inertia)
│   │   ├── routes/             # Route definitions
│   │   └── types/              # TypeScript types
│   └── views/                  # Blade templates
├── routes/                     # Route definitions
│   ├── web.php                 # Main web routes
│   ├── auth.php                # Authentication routes
│   ├── settings.php            # Settings routes
│   ├── masters.php             # Master data routes
│   └── externals.php           # External API routes
├── scripts/                    # Python scripts
│   ├── process_jira.py         # JIRA import script
│   └── requirements.txt        # Python dependencies
├── storage/                    # Storage files
├── tests/                      # Test files
└── vendor/                     # PHP dependencies
```

## 🎯 Key Features Implementation

### ChromaDB Vector Storage

Issues dan features disimpan sebagai embeddings di ChromaDB untuk semantic search:

```php
// Auto-vectorization saat issue creation
$collection = Chromadb::collection('issues');
$collection->add(
    ids: [$issue->key],
    documents: [$issue->description],
    metadatas: [['issue_key' => $issue->key]]
);
```

### AI Library Suggestion

Menggunakan OpenAI untuk analisis dan rekomendasi:

```php
// Query similar issues dari ChromaDB
$results = $collection->query(
    queryTexts: [$feature->description],
    nResults: 5
);

// Analisis dengan GPT untuk rekomendasi
$suggestions = OpenAI::chat()->create([
    'model' => 'gpt-4',
    'messages' => [/* context dan query */]
]);
```

## 🔐 Security Best Practices

- CSRF protection enabled
- XSS protection via Laravel's blade escaping
- SQL injection prevention via Eloquent ORM
- Password hashing dengan bcrypt
- Two-factor authentication support
- Session-based authentication
- Rate limiting pada sensitive endpoints
- Environment variables untuk sensitive data

## 🌐 Deployment

### Production Checklist

1. Set `APP_ENV=production` dan `APP_DEBUG=false`
2. Generate production key: `php artisan key:generate`
3. Configure production database
4. Run migrations: `php artisan migrate --force`
5. Optimize application:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan optimize
   ```
6. Build frontend assets: `npm run build`
7. Setup queue worker sebagai daemon (supervisor/systemd)
8. Configure web server (Nginx/Apache)
9. Setup SSL certificate
10. Configure backup strategy

### Environment Variables untuk Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_DRIVER=redis

BACKEND_URL=https://your-api-domain.com
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards

- Follow PSR-12 for PHP code
- Use Laravel Pint for code formatting
- Follow Airbnb style guide untuk JavaScript/TypeScript
- Write meaningful commit messages
- Add tests untuk new features
- Update documentation

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Developer**: Sandi Mulyadi

## 📞 Support

For issues, questions, or contributions, please contact:

- Email: sandimvlyadi@gmail.com
- Issue Tracker: GitHub Issues

## 🙏 Acknowledgments

- Laravel Framework
- React Community
- Inertia.js
- OpenAI
- ChromaDB
- All open-source contributors

---

**Built with ❤️ using Laravel, React, and AI**
