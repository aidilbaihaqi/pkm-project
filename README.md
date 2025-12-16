# PKM Hyperlocal UMKM Platform

## 1. Overview
PKM Hyperlocal UMKM Platform adalah aplikasi berbasis **website (Progressive Web App / PWA)** yang menggabungkan konsep **social media (reels/video pendek)** dan **e-commerce lokal** untuk mendukung digitalisasi UMKM di tingkat desa atau kampung.

Aplikasi ini menampilkan konten UMKM (video promosi, produk, dan informasi toko) yang **direkomendasikan berdasarkan lokasi terkini pengguna**, sehingga pengguna lebih mudah menemukan produk lokal terdekat. Proses transaksi dilakukan **di luar aplikasi** melalui WhatsApp untuk menjaga kesederhanaan sistem dan kemudahan bagi UMKM.

---

## 2. Tujuan Pengembangan
Tujuan utama pengembangan aplikasi ini adalah:
- Meningkatkan literasi digital UMKM desa
- Menyediakan media promosi digital yang mudah dan ramah pengguna
- Menghubungkan pembeli dengan UMKM terdekat secara cepat
- Mengurangi kompleksitas sistem e-commerce bagi UMKM pemula
- Mendorong ekonomi lokal berbasis komunitas

---

## 3. Target Pengguna
Aplikasi ini memiliki tiga peran utama:
1. **User (Pembeli)** – Masyarakat umum yang melihat dan membeli produk UMKM
2. **Seller (UMKM)** – Pelaku UMKM yang mengunggah konten dan menjual produk
3. **Admin** – Pengelola sistem yang melakukan moderasi dan manajemen data

---

## 4. Konsep Utama Aplikasi

### 4.1 Hyperlocal Content
Konten ditampilkan berdasarkan **lokasi geografis pengguna (GPS)**, sehingga UMKM di sekitar pengguna akan mendapatkan prioritas tampilan pada halaman utama.

### 4.2 Social Commerce Sederhana
- UMKM mengunggah video pendek (reels)
- User dapat melihat, membagikan, dan mengklik CTA pembelian
- Tidak ada sistem pembayaran internal

### 4.3 WhatsApp-based Transaction
Setiap konten memiliki tombol **Call To Action (CTA)** yang akan mengarahkan pengguna ke WhatsApp penjual dengan **template pesan otomatis**.

---

## 5. Flow Utama Sistem

### 5.1 Flow User (Pembeli)
1. User membuka aplikasi (PWA)
2. Sistem mendeteksi lokasi user
3. Sistem menampilkan konten UMKM terdekat
4. User melihat reels dan detail produk
5. User menekan tombol "Pesan via WhatsApp"
6. User diarahkan ke WhatsApp penjual dengan pesan otomatis

### 5.2 Flow Seller (UMKM)
1. Seller login menggunakan Google OAuth
2. Seller membuat profil toko
3. Seller mengunggah konten video promosi
4. Konten ditampilkan ke user berdasarkan lokasi
5. Seller menerima pesan dari WhatsApp user

### 5.3 Flow Admin
1. Admin login
2. Mengelola data seller
3. Mengelola kategori konten
4. Melihat statistik konten dan seller
5. Melakukan moderasi jika diperlukan

---

## 6. Role-Based Access Control (RBAC)

| Role   | Hak Akses Utama |
|-------|-----------------|
| User  | Melihat konten, klik CTA, melihat lokasi UMKM |
| Seller| Membuat profil toko, upload konten, kelola konten, lihat statistik |
| Admin | Manajemen seller, kategori konten, statistik, moderasi |

RBAC diterapkan di sisi backend untuk memastikan setiap peran hanya dapat mengakses fitur yang sesuai.

---

## 7. Authentication & Security

### 7.1 Metode Autentikasi
Aplikasi menggunakan **Google OAuth 2.0** sebagai satu-satunya metode autentikasi.

Alasan pemilihan Google OAuth:
- Mengurangi spam dan akun palsu
- Tidak perlu membuat sistem password manual
- Otentikasi lebih aman dan terpercaya
- Mendukung verifikasi OTP dari Google

### 7.2 Alur Login
1. User/Seller klik tombol Login
2. Dialihkan ke Google OAuth
3. User memilih akun Google
4. Sistem menerima token OAuth
5. Sistem membuat/memperbarui akun pengguna

---

## 8. Sistem Rekomendasi Konten
Sistem rekomendasi bekerja berdasarkan:
- Lokasi pengguna (latitude & longitude)
- Jarak UMKM ke pengguna
- Waktu unggah konten
- Interaksi konten (view dan klik CTA)

Konten akan diurutkan secara otomatis dan ditampilkan di halaman utama pengguna.

---

## 9. Teknologi yang Digunakan (Rencana)

### 9.1 Opsi Stack

#### Opsi 1 – Cepat (Direkomendasikan)
- Backend: Laravel (REST API)
- Frontend: React (PWA)
- Database: MySQL
- Media Storage: Object Storage (fixed pricing)

#### Opsi 3 – Super Cepat
- Backend: Go (Gin/Fiber)
- Frontend: React (PWA)
- Database: PostgreSQL / MySQL
- Hosting: VPS / Cloud

---

## 10. Progressive Web App (PWA)
Aplikasi mendukung fitur PWA:
- Dapat di-install di perangkat mobile
- Akses cepat melalui browser
- Tampilan mobile-first
- Caching untuk performa lebih cepat

---

## 11. Batasan Sistem (Scope v1)
- Tidak mendukung pembayaran internal
- Tidak mendukung live shopping
- Tidak ada chat internal
- Fokus pada video pendek dan CTA WhatsApp

---

## 12. Penutup
Aplikasi ini dirancang sebagai solusi digital yang **sederhana, cepat, dan relevan** untuk UMKM desa. Dengan menggabungkan konsep social media, rekomendasi lokasi, dan transaksi langsung via WhatsApp, platform ini diharapkan mampu mendorong pertumbuhan ekonomi lokal secara berkelanjutan.

