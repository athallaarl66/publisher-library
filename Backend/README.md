# Publishing Platform — Backend API

REST API untuk manajemen katalog buku, penulis, dan penerbit. Dibangun dengan Express.js, Prisma ORM, dan PostgreSQL (Neon).

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js v5
- **ORM**: Prisma v7
- **Database**: PostgreSQL (Neon — serverless cloud)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Zod
- **Dev**: ts-node + nodemon

---

## Struktur Project

```
Backend/
├── prisma/
│   ├── schema.prisma        # definisi model & relasi DB
│   ├── seed.ts              # data awal untuk demo
│   └── migrations/          # history perubahan schema
├── src/
│   ├── app.ts               # entry point, setup express & routes
│   ├── lib/
│   │   └── prisma.ts        # singleton prisma client
│   ├── middleware/
│   │   └── auth.ts          # JWT verification middleware
│   ├── routes/              # definisi endpoint per resource
│   ├── controllers/         # logic handler tiap endpoint
│   └── validators/          # zod schema untuk validasi input
├── .env.example
├── prisma.config.ts
└── package.json
```

---

## Relasi Antar Entitas

```
Author (1) ──── (many) Book
Publisher (1) ── (many) Book
```

Satu buku wajib punya tepat satu penulis dan satu penerbit.

---

## Setup & Menjalankan Lokal

### 1. Clone & Install

```bash
git clone <repo-url>
cd Backend
npm install
```

### 2. Konfigurasi Environment

Salin `.env.example` ke `.env` lalu isi sesuai environment lo:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="isi_dengan_random_string_panjang"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Migrasi Database

```bash
npm run db:migrate
```

### 4. Seed Data Awal

```bash
npm run db:seed
```

Ini akan membuat:

- 1 user demo: `admin@publishing.com` / `password123`
- 2 penerbit: Gramedia, Mizan
- 2 penulis: Pramoedya Ananta Toer, Andrea Hirata
- 2 buku: Bumi Manusia, Laskar Pelangi

### 5. Jalankan Server

```bash
npm run dev       # development (hot reload)
npm run build     # compile TypeScript
npm start         # production
```

Server berjalan di `http://localhost:5000`

---

## Endpoints

### Auth

| Method | Endpoint             | Deskripsi                   |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Daftar akun baru            |
| POST   | `/api/auth/login`    | Login, dapat JWT token      |
| GET    | `/api/auth/me`       | Info user yang sedang login |

> Semua endpoint selain register & login butuh header `Authorization: Bearer <token>`

### Authors

| Method | Endpoint           | Deskripsi                            |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/authors`     | List semua penulis                   |
| GET    | `/api/authors/:id` | Detail satu penulis + daftar bukunya |
| POST   | `/api/authors`     | Tambah penulis baru                  |
| PUT    | `/api/authors/:id` | Update data penulis                  |
| DELETE | `/api/authors/:id` | Hapus penulis                        |

### Publishers

| Method | Endpoint              | Deskripsi                             |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/publishers`     | List semua penerbit                   |
| GET    | `/api/publishers/:id` | Detail satu penerbit + daftar bukunya |
| POST   | `/api/publishers`     | Tambah penerbit baru                  |
| PUT    | `/api/publishers/:id` | Update data penerbit                  |
| DELETE | `/api/publishers/:id` | Hapus penerbit                        |

### Books

| Method | Endpoint         | Deskripsi        |
| ------ | ---------------- | ---------------- |
| GET    | `/api/books`     | List semua buku  |
| GET    | `/api/books/:id` | Detail satu buku |
| POST   | `/api/books`     | Tambah buku baru |
| PUT    | `/api/books/:id` | Update data buku |
| DELETE | `/api/books/:id` | Hapus buku       |

### Query Params untuk List Endpoints

Semua endpoint list (`GET /api/authors`, `/api/books`, `/api/publishers`) mendukung:

| Param    | Contoh         | Keterangan                                 |
| -------- | -------------- | ------------------------------------------ |
| `page`   | `?page=2`      | Halaman (default: 1)                       |
| `limit`  | `?limit=20`    | Jumlah per halaman (default: 10, max: 100) |
| `search` | `?search=pram` | Filter berdasarkan nama/judul              |
| `sortBy` | `?sortBy=name` | Field untuk sorting                        |
| `order`  | `?order=asc`   | Urutan: `asc` atau `desc`                  |

Khusus books, ada tambahan:

| Param         | Contoh           | Keterangan              |
| ------------- | ---------------- | ----------------------- |
| `authorId`    | `?authorId=1`    | Filter buku by penulis  |
| `publisherId` | `?publisherId=2` | Filter buku by penerbit |
| `genre`       | `?genre=drama`   | Filter by genre         |

---

## Format Response

Semua endpoint menggunakan format yang konsisten:

**Success:**

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**List dengan Pagination:**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Pesan error yang readable"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": ["pesan error per field"]
  }
}
```

---

## Contoh Request

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@publishing.com", "password": "password123"}'
```

### Tambah Buku (butuh token)

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Cantik Itu Luka",
    "isbn": "978-979-22-9999-1",
    "genre": "Literary Fiction",
    "authorId": 1,
    "publisherId": 1
  }'
```

---

## Scripts

```bash
npm run dev          # jalankan server development
npm run build        # compile ke JavaScript
npm start            # jalankan hasil build
npm run db:migrate   # jalankan migrasi database
npm run db:seed      # isi data awal
npm run db:studio    # buka Prisma Studio (GUI database)
```

---

## Security

- Password di-hash dengan bcrypt (cost factor 12)
- JWT token expire dalam 7 hari
- Semua endpoint CRUD dilindungi middleware auth
- Input divalidasi dengan Zod sebelum masuk ke database
- Error response tidak mengekspos detail internal server
- Timing-safe comparison pada proses login untuk mencegah user enumeration
