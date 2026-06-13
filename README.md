# Klontong Admin

Admin system untuk mengelola produk toko klontong. Dibangun dengan **Nuxt 3** (frontend) dan **NestJS** (backend).

---

## Cara Tercepat: Docker (Direkomendasikan)

> Hanya butuh **Docker Desktop** terinstall. Tidak perlu install Node.js, PostgreSQL, atau apapun lagi.

```bash
# Clone/extract project, lalu dari root direktori:
docker-compose up --build
```

Tunggu sekitar 2–3 menit. Seeder berjalan otomatis. Setelah semua container healthy:

| Service | URL |
|---|---|
| Frontend | http://localhost:4000 |
| Backend API | http://localhost:4001/api |
| Swagger Docs | http://localhost:4001/api/docs |

**Login langsung dengan:**
- `admin@klontong.com` / `admin123`
- `staff@klontong.com` / `staff123`

```bash
# Stop semua container
docker-compose down

# Reset data (hapus database volume)
docker-compose down -v
```

---

## Struktur Folder

```
/
├── apps/
│   ├── frontend/          # Nuxt 3 + Pinia + Tailwind CSS
│   │   ├── components/    # Shared components (ProductForm, dll)
│   │   ├── composables/   # useDebounce, dll
│   │   ├── layouts/       # default.vue (auth required), auth.vue (login/register)
│   │   ├── middleware/    # auth.ts — redirect ke /auth/login jika belum login
│   │   ├── pages/         # Route pages (Nuxt file-based routing)
│   │   ├── services/      # API layer (auth, products, categories)
│   │   ├── stores/        # Pinia stores (auth, products, categories)
│   │   └── types/         # TypeScript interfaces
│   └── backend/           # NestJS
│       └── src/
│           ├── auth/          # JWT auth (register, login, me)
│           ├── products/      # Product CRUD + pagination + soft-delete
│           ├── categories/    # Category management
│           └── database/
│               ├── data-source.ts
│               └── seeds/     # Seeder (~100 produk)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Setup Project

### Prasyarat
- Node.js 20+
- PostgreSQL 15+ (atau Docker)

### 1. Clone & install dependensi

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd apps/frontend
npm install
```

### 2. Environment variables

```bash
# Backend
cd apps/backend
cp .env.example .env
# Edit .env sesuai koneksi PostgreSQL kamu

# Frontend
cd apps/frontend
cp .env.example .env
```

#### Daftar environment variables

| Variable | Default | Keterangan |
|---|---|---|
| `NODE_ENV` | `development` | Mode aplikasi |
| `PORT` | `3001` | Port backend |
| `DB_HOST` | `localhost` | Host PostgreSQL |
| `DB_PORT` | `5433` | Port PostgreSQL (Docker: 5433, local: 5432) |
| `DB_USERNAME` | `postgres` | Username DB |
| `DB_PASSWORD` | `postgres` | Password DB |
| `DB_NAME` | `klontong` | Nama database |
| `JWT_SECRET` | — | **Wajib diganti** di production |
| `JWT_EXPIRES_IN` | `7d` | Durasi token |
| `FRONTEND_URL` | `http://localhost:4000` | CORS origin |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:4001/api` | Base URL API |

### 3. Buat database

```sql
CREATE DATABASE klontong;
```

### 4. Jalankan backend (dev mode)

Di mode development, `synchronize: true` — TypeORM akan otomatis membuat/update tabel.

```bash
cd apps/backend
npm run start:dev
```

Backend berjalan di `http://localhost:4001`
Swagger docs di `http://localhost:4001/api/docs`

### 5. Jalankan seeder

```bash
cd apps/backend
npm run seed
```

Seeder akan membuat:
- 8 kategori
- ~100 produk
- 2 user (lihat bagian Test Accounts)

### 6. Jalankan frontend

```bash
cd apps/frontend
npm run dev
```

Frontend berjalan di `http://localhost:4000`

---

## Jalankan dengan Docker

```bash
# Dari root direktori
docker-compose up -d

# Setelah container jalan, jalankan seeder
docker exec klontong_backend npm run seed
```

---

## Menjalankan Test

```bash
cd apps/backend
npm test           # run unit tests
npm run test:cov   # dengan coverage report
```

---

## Test Accounts

| Email | Password | Role |
|---|---|---|
| admin@klontong.com | admin123 | admin |
| staff@klontong.com | staff123 | staff |

---

## API Endpoints

Base URL: `http://localhost:4001/api`

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | — | Register user baru |
| POST | `/auth/login` | — | Login, dapat JWT token |
| GET | `/auth/me` | JWT | Info user yang login |
| GET | `/products` | JWT | List produk (pagination, search, filter, sort) |
| GET | `/products/:id` | JWT | Detail produk |
| POST | `/products` | JWT | Buat produk baru |
| PATCH | `/products/:id` | JWT | Update produk |
| DELETE | `/products/:id` | JWT | Soft-delete (arsip) produk |
| PATCH | `/products/:id/restore` | JWT | Restore produk yang diarsip |
| GET | `/categories` | JWT | List semua kategori |
| POST | `/categories` | JWT | Buat kategori baru |

Query params untuk `GET /products`:
- `page`, `limit` — pagination
- `search` — cari berdasarkan nama atau SKU
- `categoryId` — filter per kategori
- `isActive` — filter status aktif (`true`/`false`)
- `sortBy` — field sorting: `name`, `price`, `stock`, `createdAt`
- `sortOrder` — `ASC` atau `DESC`

---

## Production Gaps

### Security
- **JWT secret** wajib panjang dan random di production (bukan default)
- **Rate limiting** belum ada — endpoint login rentan brute-force; tambahkan `@nestjs/throttler`
- **Input sanitization** untuk XSS — class-validator sudah handle tipe data, tapi tidak strip HTML di description
- **HTTPS** wajib di production; semua cookie/token lewat plain HTTP sekarang
- **Helmet** belum dikonfigurasi; tambahkan `@fastify/helmet` atau `helmet` untuk HTTP security headers

### Performance
- Tidak ada **caching layer** (Redis) — query produk langsung ke DB setiap request
- **Full-text search** saat ini pakai `LIKE %keyword%` yang tidak menggunakan index; untuk skala 100k+ produk, gunakan PostgreSQL `tsvector` / `pg_trgm` atau Elasticsearch
- **Image hosting** masih pakai URL eksternal; di production pakai S3 + CDN
- Tidak ada **connection pooling** konfigurasi eksplisit (TypeORM default pool size = 10)

### Logging & Observability
- Tidak ada **structured logging** (Winston/Pino) — saat ini hanya `console.log` bawaan NestJS
- Tidak ada **request tracing** (correlation ID per request)
- Tidak ada **APM** (Datadog, New Relic, Sentry)
- Error di frontend tidak dilaporkan ke error tracking service

### Deployment
- **Docker Compose** hanya untuk development; production butuh Kubernetes atau managed container service
- **Database migrations** belum dipisah dari `synchronize: true` — di production wajib matikan `synchronize` dan gunakan migration files eksplisit
- Tidak ada **health check endpoint** (`/health`) untuk load balancer
- Tidak ada **graceful shutdown** handling

### Testing
- Coverage unit test saat ini hanya `ProductsService` (happy path + SKU conflict + not found)
- Tidak ada **integration test** (DB sebenarnya) — penting untuk memastikan query kompleks benar
- Tidak ada **e2e test** (Playwright/Cypress) untuk frontend flow
- Tidak ada **contract test** antara frontend dan backend

### Data Migration
- Saat berpindah dari `synchronize: true` ke migration files, perlu generate migration awal dengan `typeorm migration:generate`
- Penghapusan kolom butuh koordinasi — TypeORM tidak auto-drop kolom by default
- Tidak ada strategi **backup otomatis** untuk PostgreSQL
