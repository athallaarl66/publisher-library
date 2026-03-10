# Frontend — Publishing Platform

Dashboard web untuk manajemen katalog penerbitan. Terhubung ke backend via REST API.

## Tech Stack

| Layer     | Teknologi               |
| --------- | ----------------------- |
| Framework | Next.js 14 (App Router) |
| Styling   | TailwindCSS + shadcn/ui |
| State     | Zustand                 |
| HTTP      | Axios                   |
| Font      | Montserrat              |

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3000
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Pastikan backend sudah berjalan sebelum membuka frontend.

## Fitur

### Autentikasi

- Login/logout via JWT dari backend
- Token disimpan di localStorage dan cookie
- Route guard otomatis redirect ke `/login` kalau belum auth
- Auto-logout kalau token expired (intercept 401)

### Manajemen Data

- **Authors** — tambah, edit, hapus, cari by nama, tampil jumlah buku per author
- **Publishers** — tambah, edit, hapus, cari by nama, tampil jumlah buku per publisher
- **Books** — tambah, edit, hapus, cari by judul, filter by penulis / penerbit / genre

### UI/UX

- Responsive — sidebar collapsible di mobile, tabel scroll horizontal
- Filter chips yang bisa di-clear satu per satu atau sekaligus
- Loading spinner, empty state, dan error state di semua halaman
- Modal tutup dengan ESC atau klik X
- Konfirmasi dialog sebelum hapus data

## Struktur Folder

```
frontend/src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx           # dashboard wrapper + sidebar
│   │   ├── authors/page.tsx
│   │   ├── publishers/page.tsx
│   │   └── books/page.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── shared/
│       ├── Sidebar.tsx          # navigasi + user info
│       ├── PageHeader.tsx       # judul + tombol tambah
│       ├── SearchBar.tsx
│       ├── FilterChips.tsx      # chip filter clearable
│       ├── Pagination.tsx
│       ├── Modal.tsx            # close on ESC
│       ├── ConfirmDelete.tsx
│       └── FormField.tsx
├── hooks/
│   ├── useAuthors.ts
│   ├── usePublishers.ts
│   └── useBooks.ts             # termasuk filter state
├── lib/
│   └── axios.ts                # interceptor JWT otomatis
├── store/
│   └── authStore.ts            # Zustand persisted
└── middleware.ts               # route protection
```

## Color Palette

| Nama          | Hex       | Dipakai untuk    |
| ------------- | --------- | ---------------- |
| Cream         | `#FFF8F0` | Background       |
| Brown Primary | `#C08552` | Tombol, aksen    |
| Brown Muted   | `#8C5A3C` | Secondary, hover |
| Dark Brown    | `#4B2E2B` | Sidebar, text    |
