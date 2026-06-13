# Architecture Note — Klontong Admin

## Pilihan Database: PostgreSQL

Saya memilih **PostgreSQL** atas MongoDB karena:

1. **Skema produk terstruktur dan relasional** — `products` punya foreign key ke `categories` dan `users`. Relasi ini natural untuk SQL, bukan document model.
2. **Query filtering + sorting yang kompleks** lebih mudah dioptimasi di SQL (composite index, `WHERE`, `ORDER BY` per field).
3. **Constraint database-level** seperti `UNIQUE` untuk SKU dan `NOT NULL` lebih robust di PostgreSQL.
4. **Soft delete** dengan `DeleteDateColumn` TypeORM berjalan mulus di PostgreSQL.
5. Jika skala ke 100k+ produk, PostgreSQL punya ekosistem mature: `pg_trgm` untuk full-text search, partitioning, read replicas.

MongoDB cocok jika skema sering berubah atau data sangat denormalisasi — tidak relevan untuk kasus ini.

---

## Struktur Backend (NestJS)

```
src/
├── auth/               # Feature module: register, login, JWT strategy
│   ├── dto/            # RegisterDto, LoginDto — class-validator
│   ├── entities/       # User entity (bcrypt hash on insert)
│   ├── guards/         # JwtAuthGuard — applied per controller
│   └── strategies/     # PassportJS JWT strategy
├── products/           # Feature module: CRUD + list experience
│   ├── dto/            # CreateProductDto, UpdateProductDto, QueryProductDto
│   ├── entities/       # Product entity (soft-delete via DeleteDateColumn)
│   ├── products.service.ts   # Business logic (query builder, format response)
│   └── products.controller.ts
├── categories/         # Feature module: simple category management
├── database/
│   ├── data-source.ts  # TypeORM DataSource untuk CLI migration
│   └── seeds/          # Seeder: 8 kategori + ~100 produk + 2 user
└── app.module.ts       # Root module: TypeORM async config, import feature modules
```

**Prinsip utama:**
- Setiap domain punya module sendiri (auth, products, categories) — tidak ada circular dependency
- Service berisi seluruh business logic; controller hanya routing + auth guard
- `ValidationPipe` global dengan `whitelist: true` — payload yang tidak dikenal otomatis dibuang
- Response format konsisten: list produk selalu wrap dalam `{ data, meta }` untuk pagination

---

## Struktur Frontend (Nuxt 3)

```
├── pages/              # File-based routing Nuxt
│   ├── auth/           # login.vue, register.vue (layout: auth)
│   └── products/       # index.vue (list), [id].vue (detail), create.vue, [id]/edit.vue
├── stores/             # Pinia stores
│   ├── auth.store.ts   # Token + user state, persist ke localStorage
│   ├── products.store.ts  # Produk list + query state (pagination, filter)
│   └── categories.store.ts  # Kategori (fetch once, cached)
├── services/           # Pure API call layer (tidak ada UI logic)
│   ├── api.ts          # $fetch factory dengan auto-inject Bearer token
│   ├── products.service.ts
│   ├── auth.service.ts
│   └── categories.service.ts
├── components/
│   └── products/
│       └── ProductForm.vue  # Shared form untuk create + edit
├── middleware/
│   └── auth.ts         # Redirect ke /auth/login jika tidak ada token
└── composables/
    └── useDebounce.ts  # Debounce 400ms untuk search input
```

**Pola state management:**
- `useAuthStore` — sumber kebenaran untuk auth; token disimpan di localStorage
- `useProductsStore` — menyimpan query state sehingga saat navigasi kembali ke list, filter/pagination tidak reset
- `useCategoriesStore` — fetch satu kali, re-use di semua komponen (tidak fetch ulang)

---

## API Contract

Semua endpoint berawalan `/api`. Response selalu JSON.

**Authentication:** Bearer JWT di header `Authorization`.

**Pagination response:**
```json
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

**Error response** (NestJS default exception format):
```json
{ "statusCode": 400, "message": ["name should not be empty"], "error": "Bad Request" }
```

**Product query params:** `page`, `limit`, `search`, `categoryId`, `isActive`, `sortBy`, `sortOrder`

Swagger tersedia di `/api/docs` untuk eksplorasi interaktif.

---

## Trade-off karena Batas Waktu

| Apa yang tidak dibangun | Mengapa |
|---|---|
| Role-based guards di backend | Semua route hanya require JWT; tidak ada perbedaan admin vs staff di server |
| TypeORM migration files | Pakai `synchronize: true` di dev — lebih cepat iterate, tapi tidak production-safe |
| Refresh token | JWT 7d cukup untuk assignment; production butuh refresh token + blacklist |
| Integration test | Unit test ProductsService cukup untuk scope ini |
| Image upload | Pakai URL input; S3 integration butuh waktu lebih |

---

## Skalabilitas: 100 → 100.000 Produk

**Database:**
- Tambah index komposit: `(category_id, is_active, deleted_at)` untuk query filter umum
- Index GIN `pg_trgm` pada kolom `name` dan `sku` untuk `LIKE` search yang lebih cepat
- Pertimbangkan table partitioning berdasarkan `category_id` saat data sangat besar

**Backend:**
- Ganti `LIKE %keyword%` dengan PostgreSQL full-text search (`tsvector` + `GIN index`)
- Tambah Redis caching untuk list produk (TTL pendek ~30s); invalidate saat ada write
- Pisahkan read/write jika perlu (CQRS pattern dengan NestJS)
- Aktifkan TypeORM connection pool tuning (`max: 20`)

**Frontend:**
- Virtual scrolling jika list sangat panjang (vue-virtual-scroller)
- Server-side rendering (Nuxt default) sudah baik untuk initial load

---

## Rencana RBAC (Role-Based Access Control)

Saat ini `User.role` sudah ada (`admin` | `staff`). Untuk enforce di backend:

1. Buat `RolesGuard` yang membaca `@Roles('admin')` decorator
2. Apply ke endpoint sensitif: `POST /products`, `DELETE /products/:id`, `POST /categories`
3. Staff hanya bisa read + update stok
4. JWT payload sudah include `role` — tidak perlu DB lookup tambahan per request

```typescript
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
remove(...) {}
```

---

## Rencana Audit Logging

Tambahkan tabel `audit_logs`:
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(50),        -- CREATE, UPDATE, DELETE, RESTORE
  entity VARCHAR(50),        -- products, categories
  entity_id INT,
  before JSONB,              -- snapshot sebelum perubahan
  after JSONB,               -- snapshot sesudah perubahan
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Implementasi via NestJS **interceptor** atau TypeORM **subscriber** — tidak perlu modifikasi service:

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(tap((result) => this.logAudit(context, result)))
  }
}
```

---

## Yang Sengaja Tidak Dibangun

- **Email verification** — tidak ada SMTP setup; untuk assignment tidak kritis
- **Pagination dengan cursor** — offset pagination cukup untuk 100 produk; cursor pagination lebih efisien untuk 100k+ tapi lebih kompleks
- **Optimistic UI update** — sengaja skip; menambah kompleksitas state tanpa manfaat nyata di skala ini
- **Swagger auth decorator per endpoint** — Swagger UI bisa eksplorasi tapi tidak perlu semua endpoint di-annotate lengkap untuk assignment ini
- **Unit test frontend** — Vitest + @vue/test-utils butuh waktu setup yang signifikan; backend unit test lebih kritis
