# Roadmap Development – PKM Hyperlocal UMKM Platform

Dokumen ini berisi **breakdown task pengembangan sistem** untuk mempercepat proses development. Roadmap disusun agar dapat dikerjakan **paralel oleh 2 orang**:
- **Frontend (Pras)**
- **Backend (Aidil)**

Tidak menggunakan pembagian hari/tanggal, hanya fokus pada urutan dan dependensi task.

---

## 0. Setup Awal & Kesepakatan Teknis

### Frontend (Pras)
- Setup repository frontend (React + PWA)
- Konfigurasi TailwindCSS dan layout mobile-first
- Setup routing dasar (public, seller, admin)
- Setup environment variable (`API_BASE_URL`)

### Backend (Aidil)
- Setup repository backend (Laravel)
- Setup database (MySQL) dan konfigurasi migration
- Struktur modular backend (Auth, UMKM, Reels, Upload, Admin)
- Konfigurasi CORS, rate limiting, dan logging

### Bersama
- Menyepakati kontrak API (endpoint, request, response)
- Menyepakati format lokasi (latitude, longitude, radius)

---

## 1. Authentication & RBAC (Prioritas Utama)

### Backend (Aidil)
- Integrasi Google OAuth 2.0
- Pembuatan tabel `users` (role: user, seller, admin)
- Implementasi middleware Role-Based Access Control (RBAC)
- Endpoint autentikasi:
  - `GET /me`
  - `POST /logout`

### Frontend (Pras)
- Halaman login dengan tombol "Login with Google"
- Penanganan session/token login
- Proteksi route berdasarkan role pengguna

---

## 2. Manajemen Profil UMKM

### Backend (Aidil)
- Model & migration `umkm_profiles`
- Field utama: nama toko, nomor WA, alamat, lat, lng, kategori
- Endpoint:
  - `POST /umkm/profile`
  - `PUT /umkm/profile`
  - `GET /umkm/profile`
  - `GET /umkm/{id}`
- Validasi data lokasi dan nomor WhatsApp

### Frontend (Pras)
- Form pembuatan & edit profil toko
- Input lokasi (map pin / manual)
- Halaman profil UMKM publik

---

## 3. Reels & Feed Berbasis Lokasi

### Backend (Aidil)
- Model & migration `reels`
- Query feed berbasis lokasi (radius + ranking)
- Endpoint:
  - `GET /reels?lat&lng&radius&page`
  - `GET /reels/{id}`
- Implementasi ranking sederhana (jarak + waktu upload)

### Frontend (Pras)
- Halaman feed reels (infinite scroll)
- Video player reels (autoplay, mute/unmute)
- Halaman detail reels

---

## 4. WhatsApp CTA & Lokasi UMKM

### Backend (Aidil)
- Generator link WhatsApp (`wa.me`) dengan template pesan
- Logging event `click_wa`

### Frontend (Pras)
- Tombol "Pesan via WhatsApp"
- Tombol "Lihat Lokasi UMKM" (Google Maps)

---

## 5. Upload Video Konten

### Backend (Aidil)
- Integrasi object storage (pre-signed upload URL)
- Endpoint:
  - `POST /uploads/video/init`
  - `POST /reels`
- Validasi ukuran & durasi video
- Penyimpanan metadata video dan thumbnail

### Frontend (Pras)
- UI upload video reels
- Progress upload
- Generate/upload thumbnail
- Submit metadata setelah upload selesai

---

## 6. Manajemen Konten Seller

### Backend (Aidil)
- Endpoint seller:
  - `GET /seller/reels`
  - `PUT /reels/{id}`
  - `DELETE /reels/{id}`
- Statistik konten (view, click_wa)

### Frontend (Pras)
- Halaman manajemen konten seller
- Aksi edit dan hapus konten
- Tampilan statistik per konten

---

## 7. Engagement Tracking

### Backend (Aidil)
- Tabel `engagement_events`
- Endpoint:
  - `POST /reels/{id}/events`
- Throttling event untuk mencegah spam

### Frontend (Pras)
- Trigger event view
- Trigger event share
- Trigger event click CTA

---

## 8. Admin Panel (Minimal)

### Backend (Aidil)
- CRUD kategori konten
- Manajemen data seller
- Moderasi konten (block/unblock)
- Endpoint statistik seller

### Frontend (Pras)
- Dashboard admin sederhana
- Tabel seller, kategori, dan konten
- Aksi moderasi

---

## 9. PWA & Optimasi Performa

### Frontend (Pras)
- PWA manifest & install prompt
- Service worker caching
- Lazy loading video
- Skeleton loading & empty state

### Backend (Aidil)
- Cache feed berdasarkan lokasi
- Query optimization & indexing
- Response compression

---

## 10. Finalisasi & Hardening

### Backend (Aidil)
- Validasi input & sanitasi
- Rate limit login, upload, dan event
- Backup database
- Logging & error handling

### Frontend (Pras)
- UX polish (offline state, error state)
- Fallback lokasi manual jika GPS ditolak
- Cross-browser & low-end device testing

---

## Catatan Akhir
Roadmap ini dirancang agar **frontend dan backend dapat berjalan paralel** dan sistem dapat segera mencapai **Minimum Viable Product (MVP)** untuk keperluan PKM dan uji coba lapangan.

