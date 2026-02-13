# Task Flow - Aplikasi Todo

Aplikasi todo full-stack dengan frontend React dan backend NestJS.

## Fitur

- Membuat, Melihat, Mengubah, Menghapus todo
- Rekomendasi AI menggunakan Gemini AI
- Autentikasi ringan dengan header `x-user-id`
- Menggunakan docker agar deployment lebih mudah

## Autentikasi

Aplikasi ini menggunakan autentikasi sederhana berbasis header:
- Semua request API harus menyertakan header `x-user-id`
- User ID yang valid: `user-1`, `user-2`, `user-3`, `admin`
- Request tanpa `x-user-id` yang valid akan mendapat 401 Unauthorized

## Quick Start dengan Docker

### Prasyarat
- Docker
- Docker Compose

### Langkah

1. Buat file `.env` di direktori root:
```bash
cp .env.example .env
# Edit .env dan isi GEMINI_API_KEY Anda
```

2. Jalankan dengan Docker Compose:
```bash
docker-compose up -d
```

3. Akses aplikasi:
- Frontend: http://localhost
- Backend API: http://localhost:3001/api

### Stop aplikasi:
```bash
docker-compose down
```

### Lihat log:
```bash
docker-compose logs -f
```

## Setup Pengembangan

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env sesuai kebutuhan
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variabel Lingkungan

### Backend (.env)
| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| DB_HOST | Host PostgreSQL | localhost |
| DB_PORT | Port PostgreSQL | 5432 |
| DB_USERNAME | Username PostgreSQL | postgres |
| DB_PASSWORD | Password PostgreSQL | root |
| DB_NAME | Nama database | todo_db |
| GEMINI_API_KEY | API key Google Gemini | - |

NB:

*API key saya disimpan di environment variable dan hanya diakses server-side untuk mencegah exposure ke client.

### Frontend (.env)
| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| VITE_API_URL | URL API Backend | http://localhost:3001/api |

## Struktur Project

```
task-flow/
├── backend/                # Backend NestJS
│   ├── src/
│   │   ├── common/
│   │   │   ├── guard/      # Guard autentikasi
│   │   │   └── interceptor/
│   │   └── todo/           # Modul todo
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Frontend React
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Endpoint API

Semua endpoint membutuhkan header `x-user-id`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/todos | Ambil semua todo |
| GET | /api/todos/:id | Ambil todo berdasarkan ID |
| POST | /api/todos | Buat todo baru |
| PATCH | /api/todos/:id | Ubah todo |
| DELETE | /api/todos/:id | Hapus todo |
| POST | /api/todos/generate-ai | Generate rekomendasi AI |


## Langkah Teknis Yang saya terapkkan dalam project

- Saya menggunakan Gemini Gen AI untuk menghasilkan rekomendasi penyelesaian berdasarkan problem_desc. Pemilihan ini didasarkan pada pengalaman saya sebelumnya dalam mengintegrasikan Gemini API, serta kemudahan setup dan dokumentasi yang cukup jelas untuk kebutuhan prototyping dan mini project seperti ini. Integrasi dilakukan di sisi backend (NestJS) untuk memastikan keamanan API KEY. Frontend tidak langsung berinteraksi dengan layanan AI, melainkan melalui endpoint yang sediakan oleh backend
- Saya menggunakan NestJs Interceptor untuk menyeragamkan struktur response API. Semua response yang berhasil akan di bungkus dalam format standar menggunakan **ApiResponseDto**, struktur response yang di hasilkan:
```bash  
  {
      "success": true,
      "message": "success",
      "data": { ... },
      "timestamp": "2026-02-13T10:00:00.000Z"
  }
```