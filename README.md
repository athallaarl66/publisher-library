# Publishing Platform

Platform manajemen katalog penerbitan digital — mengelola Books, Authors, dan Publishers dengan autentikasi JWT.

Dibangun dengan peruntukan sebagai technical test fullstack engineer

## Stack

**Backend:** Express.js · TypeScript · Prisma v7 · PostgreSQL (Neon) · JWT · Zod  
**Frontend:** Next.js 14 · TailwindCSS · shadcn/ui · Zustand · Axios

## Cara Menjalankan

### Backend

```bash
cd Backend
npm install
cp .env.example .env        # isi DATABASE_URL dan JWT_SECRET
npm run db:migrate
npm run db:seed
npm run dev                  # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # isi NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                  # http://localhost:3000
```

### Demo Login

```
Email    : admin@publishing.com
Password : password123
```

## Fitur

### Backend

- JWT auth: register, login, get profile
- CRUD Authors, Publishers, Books — semua endpoint di-protect
- Pagination, search, sort di semua list endpoint
- Filter books by author, publisher, genre
- Validasi input dengan Zod
- Seeder: 10 authors, 6 publishers, 17 books

### Frontend

- Login/logout dengan JWT handling otomatis
- Filter chips yang bisa di-clear per item atau sekaligus
- Responsive — mobile sidebar drawer, tabel scroll horizontal
- Loading, empty state, error state di semua halaman
- Konfirmasi sebelum hapus, modal tutup dengan ESC

## Struktur

```
publishing-platform/
├── Backend/
│   ├── prisma/              # schema, migration, seed
│   ├── src/
│   │   ├── controllers/     # business logic
│   │   ├── middleware/      # JWT auth
│   │   ├── routes/          # endpoint definitions
│   │   └── validators/      # Zod schemas
│   └── .env.example
└── frontend/
    └── src/
        ├── app/             # Next.js App Router pages
        ├── components/      # reusable UI components
        ├── hooks/           # data fetching hooks
        ├── lib/             # axios instance
        └── store/           # Zustand auth state
```
