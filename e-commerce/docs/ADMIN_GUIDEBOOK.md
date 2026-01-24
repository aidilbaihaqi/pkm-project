# PANDUAN PENGGUNA ADMIN DASHBOARD
## Platform PKM Hyperlocal UMKM E-Commerce

---

**Versi:** 1.0  
**Tanggal:** Januari 2025  
**Untuk:** Administrator Platform

---

## DAFTAR ISI

1. [Pengenalan](#1-pengenalan)
2. [Memulai](#2-memulai)
3. [Dashboard Utama](#3-dashboard-utama)
4. [Manajemen Seller](#4-manajemen-seller)
5. [Moderasi Konten](#5-moderasi-konten)
6. [Manajemen Kategori](#6-manajemen-kategori)
7. [Statistik & Analytics](#7-statistik--analytics)
8. [FAQ & Troubleshooting](#8-faq--troubleshooting)
9. [Daftar Pustaka](#9-daftar-pustaka)

---

## 1. PENGENALAN

### 1.1 Tentang Platform

Platform PKM Hyperlocal UMKM adalah sistem e-commerce berbasis lokasi yang dirancang untuk membantu UMKM (Usaha Mikro, Kecil, dan Menengah) mempromosikan produk mereka melalui konten video dan gambar, mirip dengan TikTok Shop namun fokus pada bisnis lokal.

**Fitur Utama Platform:**
- 📍 Pencarian berbasis lokasi (hyperlocal)
- 🎥 Konten video/gambar produk (Reels)
- 💬 Integrasi WhatsApp untuk komunikasi langsung
- 📊 Tracking engagement (views, likes, shares)
- 🏪 Profil UMKM dengan informasi lengkap

### 1.2 Peran Administrator

Sebagai administrator, Anda memiliki tanggung jawab untuk:


✅ **Mengawasi aktivitas platform** - Memantau statistik pengguna, seller, dan konten  
✅ **Mengelola seller** - Menyetujui, memblokir, atau membuka blokir akun seller  
✅ **Moderasi konten** - Meninjau dan menghapus konten yang tidak sesuai  
✅ **Mengelola kategori** - Membuat, mengedit, dan menghapus kategori produk  
✅ **Menganalisis performa** - Memantau engagement dan tren platform  

### 1.3 Akses & Keamanan

**Hak Akses Admin:**
- Akses penuh ke semua fitur dashboard
- Dapat melihat data semua seller dan konten
- Dapat melakukan tindakan moderasi
- Tidak dapat mengakses data pribadi sensitif pengguna

**Keamanan:**
- Login menggunakan Google OAuth (WorkOS)
- Session timeout otomatis setelah periode inaktif
- Semua tindakan admin tercatat dalam log sistem
- CSRF protection untuk semua aksi

---

## 2. MEMULAI

### 2.1 Cara Login

**Langkah-langkah Login:**

1. **Buka halaman login admin**
   ```
   https://[domain-platform]/login
   ```

2. **Klik tombol "Login dengan Google"**
   - Sistem akan mengarahkan Anda ke halaman Google OAuth

3. **Pilih akun Google yang terdaftar sebagai admin**
   - Pastikan menggunakan email yang sudah didaftarkan sebagai admin

4. **Anda akan diarahkan ke Dashboard Admin**
   - Jika berhasil, Anda akan melihat halaman dashboard dengan statistik platform



**⚠️ Catatan Penting:**
- Hanya email yang terdaftar sebagai admin yang dapat mengakses dashboard
- Jika Anda tidak dapat login, hubungi super admin untuk verifikasi akun
- Jangan bagikan akses login Anda kepada orang lain

### 2.2 Navigasi Dashboard

Setelah login, Anda akan melihat sidebar navigasi dengan menu berikut:

| Menu | Deskripsi |
|------|-----------|
| 🏠 **Dashboard** | Halaman utama dengan ringkasan statistik |
| 👥 **Sellers** | Manajemen akun seller |
| 📂 **Categories** | Manajemen kategori produk |
| 📊 **Statistics** | Analisis mendalam dan grafik tren |
| 🛡️ **Moderation** | Review dan moderasi konten |

**Tips Navigasi:**
- Klik menu di sidebar untuk berpindah halaman
- Gunakan tombol refresh (🔄) untuk memperbarui data
- Dashboard responsif dan dapat diakses dari mobile

### 2.3 Logout

**Cara Logout:**

1. Klik **avatar/foto profil** Anda di pojok kanan atas
2. Pilih **"Logout"** dari dropdown menu
3. Anda akan diarahkan kembali ke halaman login

---

## 3. DASHBOARD UTAMA

### 3.1 Ringkasan Statistik

Dashboard utama menampilkan 4 metrik utama platform:



#### 📊 Metrik Platform

**1. Total Users** (Orange Card)
- Jumlah total pengguna yang terdaftar
- Tidak termasuk admin
- Indikator: Pertumbuhan basis pengguna

**2. Active Sellers** (Green Card)
- Jumlah seller yang aktif di platform
- Seller yang sudah membuat profil UMKM
- Indikator: Jumlah bisnis yang bergabung

**3. Total Content** (Blue Card)
- Jumlah total konten (reels) yang dipublikasikan
- Termasuk video dan gambar produk
- Indikator: Aktivitas konten di platform

**4. Total Views** (Purple Card)
- Total views dari semua konten
- Menunjukkan engagement pengguna
- Indikator: Popularitas platform

#### 💬 Engagement Metrics

Di bawah metrik utama, terdapat 3 metrik engagement:

- **❤️ Total Likes** - Jumlah like pada semua konten
- **🔄 Total Shares** - Jumlah konten yang dibagikan
- **💬 WhatsApp Clicks** - Jumlah klik tombol WhatsApp (konversi)

### 3.2 Preview Seller Terbaru

Dashboard menampilkan **5 seller terbaru** dengan informasi:
- Nama seller
- Email
- Nama UMKM & kategori
- Jumlah reels
- Total views
- Status (Active/Blocked)

**Fungsi:**
- Quick preview untuk melihat seller baru
- Klik menu "Sellers" untuk melihat daftar lengkap



### 3.3 Refresh Data

**Cara Refresh Data:**

1. Klik tombol **🔄 Refresh** di pojok kanan atas
2. Data akan dimuat ulang dari server
3. Loading indicator akan muncul saat proses refresh

**Kapan Perlu Refresh:**
- Setelah melakukan tindakan moderasi
- Untuk melihat data terbaru
- Jika data terlihat tidak update

---

## 4. MANAJEMEN SELLER

### 4.1 Melihat Daftar Seller

**Akses:** Klik menu **"Sellers"** di sidebar

**Informasi yang Ditampilkan:**

| Kolom | Keterangan |
|-------|------------|
| **Nama** | Nama lengkap seller |
| **Email** | Email akun seller |
| **UMKM** | Nama toko & kategori bisnis |
| **Reels** | Jumlah konten yang dibuat |
| **Views** | Total views konten seller |
| **Status** | Active (hijau) / Blocked (merah) |
| **Aksi** | Tombol Block/Unblock |

**Fitur Pagination:**
- Menampilkan 10 seller per halaman
- Gunakan tombol **"Prev"** dan **"Next"** untuk navigasi
- Total seller ditampilkan di bawah tabel

### 4.2 Memblokir Seller

**Kapan Memblokir Seller:**
- Konten melanggar kebijakan platform
- Laporan spam atau penipuan
- Aktivitas mencurigakan
- Pelanggaran berulang



**Langkah-langkah Memblokir:**

1. **Temukan seller** yang ingin diblokir di tabel
2. **Klik tombol "Block"** (merah) di kolom Aksi
3. **Konfirmasi tindakan** jika diminta
4. Status seller akan berubah menjadi **"Blocked"** (merah)
5. Tombol berubah menjadi **"Unblock"** (hijau)

**Efek Pemblokiran:**
- ❌ Konten seller tidak muncul di feed publik
- ❌ Profil UMKM tidak dapat diakses
- ❌ Seller tidak dapat upload konten baru
- ✅ Data seller tetap tersimpan di database
- ✅ Seller masih dapat login (tapi tidak bisa aksi)

**⚠️ Catatan:**
- Pemblokiran bersifat reversible (dapat dibatalkan)
- Seller tidak menerima notifikasi otomatis
- Pertimbangkan untuk menghubungi seller sebelum memblokir

### 4.3 Membuka Blokir Seller

**Kapan Membuka Blokir:**
- Seller sudah memperbaiki pelanggaran
- Kesalahpahaman sudah diselesaikan
- Permintaan banding diterima

**Langkah-langkah Unblock:**

1. **Temukan seller** yang diblokir (status merah)
2. **Klik tombol "Unblock"** (hijau) di kolom Aksi
3. **Konfirmasi tindakan**
4. Status seller kembali menjadi **"Active"** (hijau)
5. Konten seller kembali muncul di platform



### 4.4 Melihat Detail Seller

**Informasi yang Dapat Dilihat:**

Dari tabel seller, Anda dapat melihat:
- **Statistik Engagement:**
  - Total views konten seller
  - Total likes
  - Total shares
  - Total WhatsApp clicks
- **Informasi UMKM:**
  - Nama toko
  - Kategori bisnis
  - Jumlah konten yang dibuat

**Tips Monitoring:**
- Seller dengan views tinggi = konten populer
- Seller dengan banyak WA clicks = konversi bagus
- Seller tanpa UMKM profile = belum lengkap setup

---

## 5. MODERASI KONTEN

### 5.1 Akses Moderasi

**Akses:** Klik menu **"Moderation"** di sidebar

**Tampilan:**
- Grid konten (4 kolom di desktop, responsif di mobile)
- Thumbnail konten dengan aspect ratio 9:16 (vertical)
- Hover untuk melihat detail dan tombol aksi

### 5.2 Review Konten

**Informasi yang Ditampilkan:**

Saat hover pada konten, Anda akan melihat:
- **Nama Toko** - Pemilik konten
- **Deskripsi** - Caption produk
- **Tombol Hapus** - Untuk menghapus konten

**Kriteria Konten yang Perlu Dimoderasi:**



❌ **Konten yang Harus Dihapus:**
- Konten pornografi atau vulgar
- Kekerasan atau hate speech
- Penipuan atau scam
- Produk ilegal (narkoba, senjata, dll)
- Spam atau clickbait berlebihan
- Pelanggaran hak cipta
- Informasi menyesatkan

✅ **Konten yang Diperbolehkan:**
- Promosi produk UMKM yang sah
- Konten edukatif tentang produk
- Review produk yang jujur
- Behind-the-scenes bisnis
- Tutorial penggunaan produk

### 5.3 Menghapus Konten

**Langkah-langkah Menghapus:**

1. **Hover pada konten** yang ingin dihapus
2. **Klik tombol "🛡️ Hapus"** (merah) di bagian bawah
3. **Konfirmasi penghapusan** pada dialog popup
   - Pesan: "Hapus konten ini secara permanen?"
4. **Klik "OK"** untuk konfirmasi
5. Konten akan **dihapus permanen** dari database

**⚠️ PERINGATAN PENTING:**
- Penghapusan bersifat **PERMANEN** dan tidak dapat dibatalkan
- Data engagement (views, likes) juga akan hilang
- Seller tidak menerima notifikasi otomatis
- Pertimbangkan untuk menghubungi seller terlebih dahulu

**Best Practice:**
- Screenshot konten sebelum menghapus (untuk dokumentasi)
- Catat alasan penghapusan
- Komunikasikan dengan seller jika perlu
- Review kebijakan platform secara berkala



### 5.4 Pagination Konten

**Navigasi:**
- Menampilkan **12 konten per halaman**
- Tombol **◀** (Previous) dan **▶** (Next) di bawah grid
- Indikator halaman saat ini ditampilkan di tengah

**Tips:**
- Review konten secara berkala (harian/mingguan)
- Prioritaskan konten yang dilaporkan pengguna
- Gunakan filter kategori jika tersedia

---

## 6. MANAJEMEN KATEGORI

### 6.1 Melihat Daftar Kategori

**Akses:** Klik menu **"Categories"** di sidebar

**Tampilan:**
- Grid kategori (3 kolom di desktop)
- Setiap card menampilkan:
  - **Nama kategori**
  - **Deskripsi**
  - **Slug** (URL-friendly name)
  - **Tombol Edit** (🔄 biru)
  - **Tombol Hapus** (🛡️ merah)

### 6.2 Menambah Kategori Baru

**Langkah-langkah:**

1. **Klik tombol "➕ Tambah Kategori"** di pojok kanan atas
2. **Modal form** akan muncul
3. **Isi form:**
   - **Nama** (wajib) - Contoh: "Makanan & Minuman"
   - **Deskripsi** (opsional) - Contoh: "Produk kuliner dan minuman"
4. **Klik "Simpan"**
5. Kategori baru akan muncul di grid



**Catatan:**
- Slug akan dibuat otomatis dari nama (lowercase, spasi jadi dash)
- Contoh: "Makanan & Minuman" → "makanan-minuman"
- Nama kategori harus unik

**Contoh Kategori yang Umum:**
- 🍔 Makanan & Minuman
- 👕 Fashion & Pakaian
- 🎨 Kerajinan Tangan
- 💄 Kecantikan & Kesehatan
- 🏠 Rumah Tangga
- 📱 Elektronik & Gadget
- 🌱 Pertanian & Perkebunan
- 🎓 Jasa & Layanan

### 6.3 Mengedit Kategori

**Langkah-langkah:**

1. **Klik tombol Edit (🔄)** pada kategori yang ingin diubah
2. **Modal form** akan muncul dengan data kategori
3. **Ubah informasi** yang diperlukan:
   - Nama kategori
   - Deskripsi
4. **Klik "Simpan"**
5. Perubahan akan langsung terlihat

**Tips:**
- Hindari mengubah nama kategori yang sudah banyak digunakan
- Update deskripsi untuk memperjelas kategori
- Slug akan otomatis update jika nama diubah

### 6.4 Menghapus Kategori

**Langkah-langkah:**

1. **Klik tombol Hapus (🛡️)** pada kategori
2. **Konfirmasi penghapusan** pada dialog
   - Pesan: "Hapus kategori ini?"
3. **Klik "OK"**
4. Kategori akan dihapus



**⚠️ PERINGATAN:**
- Penghapusan kategori bersifat permanen
- Konten yang menggunakan kategori ini mungkin terpengaruh
- Pastikan tidak ada konten aktif yang menggunakan kategori tersebut
- Pertimbangkan untuk mengedit daripada menghapus

**Best Practice:**
- Buat kategori yang spesifik tapi tidak terlalu detail
- Gunakan nama yang mudah dipahami seller
- Review kategori secara berkala
- Gabungkan kategori yang jarang digunakan

---

## 7. STATISTIK & ANALYTICS

### 7.1 Akses Statistik Lanjutan

**Akses:** Klik menu **"Statistics"** di sidebar

**Tampilan:**
- Metrik platform lengkap (sama seperti dashboard)
- **Metrik Performa Rata-rata** (4 card tambahan)
- **Grafik Tren** (jika tersedia)
- **Top Sellers** (jika tersedia)

### 7.2 Metrik Performa

**Views per Video**
- Rata-rata views untuk setiap konten
- Formula: Total Views ÷ Total Reels
- Indikator: Kualitas konten platform
- Target: Semakin tinggi semakin baik

**Likes per Video**
- Rata-rata likes untuk setiap konten
- Formula: Total Likes ÷ Total Reels
- Indikator: Engagement rate konten
- Target: > 5% dari views



**Engagement Rate**
- Persentase interaksi dari views
- Formula: ((Likes + Shares) ÷ Views) × 100%
- Indikator: Kualitas engagement
- Target: 5-10% = bagus, >10% = sangat bagus

**Conversion Rate**
- Persentase klik WhatsApp dari views
- Formula: (WA Clicks ÷ Views) × 100%
- Indikator: Efektivitas konversi
- Target: 2-5% = bagus, >5% = sangat bagus

### 7.3 Interpretasi Data

**Skenario 1: Views Tinggi, Engagement Rendah**
- Konten menarik perhatian tapi tidak engaging
- Solusi: Edukasi seller tentang konten berkualitas
- Fokus: Improve caption, CTA, dan storytelling

**Skenario 2: Engagement Tinggi, Conversion Rendah**
- Konten menarik tapi tidak mendorong pembelian
- Solusi: Perbaiki CTA WhatsApp, harga, dan deskripsi produk
- Fokus: Optimize product presentation

**Skenario 3: Seller Banyak, Konten Sedikit**
- Seller tidak aktif upload konten
- Solusi: Campaign untuk mendorong upload konten
- Fokus: Edukasi dan insentif untuk seller

**Skenario 4: Konten Banyak, Views Rendah**
- Masalah discovery atau kualitas konten
- Solusi: Improve algoritma feed atau moderasi ketat
- Fokus: Quality over quantity



### 7.4 Monitoring Berkala

**Daily Monitoring:**
- ✅ Cek total views dan engagement
- ✅ Review konten baru yang diupload
- ✅ Tangani laporan atau komplain

**Weekly Monitoring:**
- ✅ Analisis tren engagement
- ✅ Identifikasi top performing sellers
- ✅ Review kategori yang populer
- ✅ Evaluasi konten yang perlu dimoderasi

**Monthly Monitoring:**
- ✅ Laporan pertumbuhan platform
- ✅ Analisis retention seller
- ✅ Evaluasi efektivitas kategori
- ✅ Planning untuk improvement

**Tips Analisis:**
- Bandingkan data periode sebelumnya
- Identifikasi pola dan tren
- Fokus pada metrik yang actionable
- Dokumentasikan insight untuk improvement

---

## 8. FAQ & TROUBLESHOOTING

### 8.1 Pertanyaan Umum

**Q: Bagaimana cara menambah admin baru?**
A: Saat ini penambahan admin dilakukan oleh super admin melalui database. Hubungi tim teknis untuk menambahkan email admin baru dengan role "admin".

**Q: Apakah seller menerima notifikasi saat diblokir?**
A: Tidak, sistem tidak mengirim notifikasi otomatis. Disarankan untuk menghubungi seller secara manual via email sebelum atau setelah pemblokiran.



**Q: Bisakah konten yang dihapus dikembalikan?**
A: Tidak, penghapusan konten bersifat permanen. Pastikan untuk review dengan teliti sebelum menghapus.

**Q: Bagaimana cara melihat konten yang dilaporkan pengguna?**
A: Fitur laporan pengguna sedang dalam pengembangan. Saat ini moderasi dilakukan secara manual melalui menu Moderation.

**Q: Apakah ada log aktivitas admin?**
A: Ya, semua tindakan admin tercatat di log sistem backend. Hubungi tim teknis untuk mengakses log.

**Q: Bagaimana cara mengubah password admin?**
A: Platform menggunakan Google OAuth, tidak ada password. Keamanan akun dikelola oleh Google.

**Q: Seller komplain kontennya tidak muncul, apa yang harus dilakukan?**
A: Cek apakah:
1. Seller sudah membuat profil UMKM
2. Konten berstatus "published" (bukan draft/review)
3. Seller tidak dalam status blocked
4. Konten tidak melanggar kebijakan

**Q: Bagaimana cara export data statistik?**
A: Fitur export sedang dalam pengembangan. Saat ini data dapat dicatat manual atau hubungi tim teknis untuk export database.

### 8.2 Troubleshooting

**Masalah: Tidak bisa login**

Solusi:
1. ✅ Pastikan menggunakan email yang terdaftar sebagai admin
2. ✅ Clear browser cache dan cookies
3. ✅ Coba browser lain atau incognito mode
4. ✅ Hubungi super admin untuk verifikasi akun



**Masalah: Data tidak update/refresh**

Solusi:
1. ✅ Klik tombol Refresh (🔄) di dashboard
2. ✅ Reload halaman browser (F5 atau Ctrl+R)
3. ✅ Clear browser cache
4. ✅ Cek koneksi internet

**Masalah: Tombol Block/Unblock tidak berfungsi**

Solusi:
1. ✅ Pastikan seller memiliki profil UMKM
2. ✅ Refresh halaman dan coba lagi
3. ✅ Cek console browser untuk error (F12)
4. ✅ Hubungi tim teknis jika masalah berlanjut

**Masalah: Konten tidak bisa dihapus**

Solusi:
1. ✅ Pastikan Anda memiliki hak akses admin
2. ✅ Refresh halaman dan coba lagi
3. ✅ Cek apakah konten masih ada di database
4. ✅ Hubungi tim teknis untuk penghapusan manual

**Masalah: Kategori tidak bisa ditambah/edit**

Solusi:
1. ✅ Pastikan nama kategori tidak duplikat
2. ✅ Isi semua field yang wajib (nama)
3. ✅ Cek format input (tidak ada karakter khusus berlebihan)
4. ✅ Refresh dan coba lagi

**Masalah: Statistik menunjukkan angka 0 semua**

Solusi:
1. ✅ Pastikan ada data di platform (seller, konten, engagement)
2. ✅ Refresh halaman
3. ✅ Cek koneksi ke database
4. ✅ Hubungi tim teknis untuk investigasi



### 8.3 Kontak Support

Jika mengalami masalah teknis yang tidak dapat diselesaikan:

**Tim Teknis:**
- Email: [email-support@platform.com]
- WhatsApp: [nomor-support]
- Jam Kerja: Senin-Jumat, 09:00-17:00 WIB

**Informasi yang Perlu Disiapkan:**
- Screenshot error/masalah
- Langkah-langkah yang sudah dicoba
- Browser dan device yang digunakan
- Waktu kejadian masalah

---

## 9. DAFTAR PUSTAKA

### A. Dokumentasi Platform

1. **Tim Pengembang PKM UMKM**. (2025). *Platform PKM Hyperlocal UMKM - Dokumentasi Teknis*. Universitas [Nama Universitas].

2. **Tim Pengembang PKM UMKM**. (2025). *API Documentation - Platform PKM Hyperlocal UMKM*. Retrieved from `/docs/API.md`

### B. Panduan Manajemen Konten Digital

3. **Nielsen, J.** (2012). *Usability 101: Introduction to Usability*. Nielsen Norman Group. Retrieved from https://www.nngroup.com/articles/usability-101-introduction-to-usability/

4. **Krug, S.** (2014). *Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability* (3rd ed.). New Riders.

### C. Moderasi Konten & Community Management

5. **Grimmelmann, J.** (2015). *The Virtues of Moderation*. Yale Journal of Law and Technology, 17(1), 42-109.


6. **Meta.** (2024). *Community Standards - Content Moderation Guidelines*. Retrieved from https://transparency.fb.com/policies/community-standards/

7. **Roberts, S. T.** (2019). *Behind the Screen: Content Moderation in the Shadows of Social Media*. Yale University Press.

### D. Dashboard & Analytics

8. **Few, S.** (2013). *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring* (2nd ed.). Analytics Press.

9. **Kaushik, A.** (2010). *Web Analytics 2.0: The Art of Online Accountability and Science of Customer Centricity*. Sybex.

10. **Google Analytics.** (2024). *Understanding Engagement Metrics*. Retrieved from https://support.google.com/analytics/

### E. Manajemen UMKM & E-Commerce

11. **Kementerian Koperasi dan UKM RI.** (2024). *Pedoman Pengembangan UMKM Digital*. Jakarta: Kemenkop UKM.

12. **Kementerian Komunikasi dan Informatika RI.** (2023). *Panduan Digitalisasi UMKM Indonesia*. Jakarta: Kominfo.

13. **Turban, E., Outland, J., King, D., Lee, J. K., Liang, T. P., & Turban, D. C.** (2017). *Electronic Commerce 2018: A Managerial and Social Networks Perspective* (9th ed.). Springer.

### F. User Experience & Interface Design

14. **Norman, D. A.** (2013). *The Design of Everyday Things: Revised and Expanded Edition*. Basic Books.

15. **Cooper, A., Reimann, R., Cronin, D., & Noessel, C.** (2014). *About Face: The Essentials of Interaction Design* (4th ed.). Wiley.


### G. Data Privacy & Security

16. **Undang-Undang Republik Indonesia Nomor 27 Tahun 2022** tentang Perlindungan Data Pribadi.

17. **Kominfo RI.** (2024). *Pedoman Keamanan Data dan Privasi Pengguna Platform Digital*. Jakarta: Kementerian Komunikasi dan Informatika.

18. **GDPR.** (2018). *General Data Protection Regulation - User Rights and Data Management*. European Union.

### H. Social Commerce & WhatsApp Business

19. **Meta Business.** (2024). *WhatsApp Business - Best Practices Guide*. Retrieved from https://business.whatsapp.com/

20. **Liang, T. P., & Turban, E.** (2011). *Introduction to the Special Issue Social Commerce: A Research Framework for Social Commerce*. International Journal of Electronic Commerce, 16(2), 5-14.

### I. Geolokasi & Hyperlocal Marketing

21. **Molitor, D., Reichhart, P., Spann, M., & Ghose, A.** (2020). *Measuring the Effectiveness of Location-Based Advertising: A Randomized Field Experiment*. Marketing Science, 39(3), 626-642.

22. **Dhar, S., & Varshney, U.** (2011). *Challenges and Business Models for Mobile Location-based Services and Advertising*. Communications of the ACM, 54(5), 121-128.

### J. Customer Engagement Metrics

23. **Hoffman, D. L., & Fodor, M.** (2010). *Can You Measure the ROI of Your Social Media Marketing?*. MIT Sloan Management Review, 52(1), 41-49.

24. **Kumar, V., & Pansari, A.** (2016). *Competitive Advantage Through Engagement*. Journal of Marketing Research, 53(4), 497-514.


### K. Platform Administration Best Practices

25. **Spolsky, J.** (2004). *User Interface Design for Programmers*. Apress.

26. **Wroblewski, L.** (2008). *Web Form Design: Filling in the Blanks*. Rosenfeld Media.

27. **Tidwell, J., Brewer, C., & Valencia, A.** (2020). *Designing Interfaces: Patterns for Effective Interaction Design* (3rd ed.). O'Reilly Media.

### L. Kategori & Taksonomi Konten

28. **Rosenfeld, L., Morville, P., & Arango, J.** (2015). *Information Architecture: For the Web and Beyond* (4th ed.). O'Reilly Media.

29. **Spencer, D.** (2009). *Card Sorting: Designing Usable Categories*. Rosenfeld Media.

### M. Accessibility & Inclusive Design

30. **W3C.** (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*. Retrieved from https://www.w3.org/WAI/WCAG22/quickref/

31. **Henry, S. L.** (2007). *Just Ask: Integrating Accessibility Throughout Design*. Lulu.com.

### N. Troubleshooting & Support

32. **Redish, J.** (2012). *Letting Go of the Words: Writing Web Content that Works* (2nd ed.). Morgan Kaufmann.

33. **Barker, D.** (2016). *Web Content Management: Systems, Features, and Best Practices*. O'Reilly Media.

### O. Referensi Tambahan

34. **Peraturan Menteri Koperasi dan UKM** Nomor 2 Tahun 2021 tentang Pedoman Umum Pengembangan Koperasi dan UMKM Berbasis Digital.

35. **ISO 9241-11:2018** - Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts.



---

## LAMPIRAN

### A. Checklist Harian Admin

**Pagi (09:00 - 10:00)**
- [ ] Login ke dashboard
- [ ] Cek statistik platform (users, sellers, content, views)
- [ ] Review konten baru yang diupload (24 jam terakhir)
- [ ] Cek laporan atau komplain dari seller/user

**Siang (12:00 - 13:00)**
- [ ] Moderasi konten yang mencurigakan
- [ ] Tangani seller yang bermasalah
- [ ] Update kategori jika diperlukan

**Sore (16:00 - 17:00)**
- [ ] Review engagement metrics
- [ ] Dokumentasi tindakan yang dilakukan hari ini
- [ ] Persiapan untuk esok hari

### B. Checklist Mingguan Admin

**Setiap Senin:**
- [ ] Analisis tren engagement minggu lalu
- [ ] Identifikasi top performing sellers
- [ ] Review kategori yang populer
- [ ] Planning moderasi untuk minggu ini

**Setiap Jumat:**
- [ ] Laporan mingguan ke tim
- [ ] Evaluasi efektivitas moderasi
- [ ] Dokumentasi insight dan learning

### C. Kebijakan Konten Platform

**Konten yang DILARANG:**
1. Pornografi, konten dewasa, atau vulgar
2. Kekerasan, hate speech, atau diskriminasi
3. Penipuan, scam, atau informasi menyesatkan
4. Produk ilegal (narkoba, senjata, rokok, alkohol tanpa izin)
5. Pelanggaran hak cipta atau trademark
6. Spam atau clickbait berlebihan
7. Konten politik atau SARA


**Konten yang DIPERBOLEHKAN:**
1. Promosi produk UMKM yang sah dan legal
2. Konten edukatif tentang produk atau bisnis
3. Review produk yang jujur dan objektif
4. Behind-the-scenes proses produksi
5. Tutorial penggunaan produk
6. Testimoni pelanggan yang autentik
7. Informasi promo atau diskon

**Tindakan Moderasi:**
- **Peringatan Pertama:** Kontak seller, minta perbaikan
- **Peringatan Kedua:** Hapus konten, dokumentasi pelanggaran
- **Pelanggaran Berulang:** Block seller sementara
- **Pelanggaran Berat:** Block seller permanen

### D. Template Komunikasi dengan Seller

**Template Email - Peringatan Konten:**

```
Subject: Peringatan Konten - Platform PKM UMKM

Halo [Nama Seller],

Kami dari tim admin Platform PKM UMKM ingin menginformasikan bahwa konten Anda dengan judul "[Judul Konten]" telah melanggar kebijakan platform kami.

Pelanggaran: [Jelaskan pelanggaran]

Tindakan yang kami ambil: [Hapus konten / Peringatan]

Mohon untuk lebih memperhatikan kebijakan konten kami di masa mendatang. Anda dapat membaca kebijakan lengkap di [link].

Jika ada pertanyaan, silakan hubungi kami.

Terima kasih,
Tim Admin Platform PKM UMKM
```

**Template Email - Pemblokiran Akun:**

```
Subject: Pemblokiran Akun - Platform PKM UMKM

Halo [Nama Seller],

Dengan berat hati kami informasikan bahwa akun UMKM Anda telah diblokir sementara dari Platform PKM UMKM.

Alasan: [Jelaskan alasan pemblokiran]

Selama masa pemblokiran:
- Konten Anda tidak akan muncul di platform
- Anda tidak dapat mengupload konten baru
- Profil UMKM tidak dapat diakses publik

Jika Anda merasa ini adalah kesalahan atau ingin mengajukan banding, silakan hubungi kami di [email/whatsapp] dengan menyertakan:
1. Penjelasan situasi
2. Bukti pendukung (jika ada)
3. Komitmen untuk mematuhi kebijakan

Terima kasih atas pengertiannya.

Tim Admin Platform PKM UMKM
```

### E. Glossary (Istilah Penting)

| Istilah | Definisi |
|---------|----------|
| **Admin** | Administrator platform dengan akses penuh ke dashboard |
| **Seller** | Pemilik UMKM yang dapat upload konten dan membuat profil |
| **User** | Pengguna umum yang melihat konten (tidak perlu login) |
| **Reel** | Konten video atau gambar produk yang diupload seller |
| **UMKM Profile** | Profil toko/bisnis seller dengan info lengkap |
| **Engagement** | Interaksi pengguna (views, likes, shares, WA clicks) |
| **Block** | Menonaktifkan akun seller dan menyembunyikan kontennya |
| **Moderation** | Proses review dan penghapusan konten yang melanggar |
| **Kategori** | Klasifikasi produk/bisnis (makanan, fashion, dll) |
| **Conversion** | Klik tombol WhatsApp (menunjukkan minat beli) |
| **Hyperlocal** | Fokus pada area geografis yang sangat spesifik |
| **Feed** | Tampilan konten yang muncul untuk pengguna |


### F. Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|--------|
| `F5` atau `Ctrl+R` | Refresh halaman |
| `Ctrl+F` | Cari di halaman |
| `F12` | Buka Developer Console (untuk troubleshooting) |
| `Ctrl+Shift+Delete` | Clear browser cache |
| `Alt+←` | Kembali ke halaman sebelumnya |
| `Alt+→` | Maju ke halaman berikutnya |

### G. Browser yang Disarankan

**Rekomendasi:**
- ✅ Google Chrome (versi terbaru)
- ✅ Mozilla Firefox (versi terbaru)
- ✅ Microsoft Edge (versi terbaru)
- ✅ Safari (untuk macOS)

**Tidak Disarankan:**
- ❌ Internet Explorer (sudah tidak didukung)
- ❌ Browser versi lama (update ke versi terbaru)

**Tips:**
- Selalu gunakan browser versi terbaru
- Enable JavaScript
- Allow cookies untuk domain platform
- Disable ad-blocker jika ada masalah loading

---

## PENUTUP

Panduan ini disusun untuk membantu administrator dalam mengelola Platform PKM Hyperlocal UMKM dengan efektif dan efisien. Sebagai admin, Anda memiliki peran penting dalam menjaga kualitas konten, melindungi pengguna, dan mendukung pertumbuhan UMKM lokal.

**Prinsip Utama Admin:**
1. 🎯 **Fair & Konsisten** - Terapkan kebijakan secara adil untuk semua seller
2. 🤝 **Komunikatif** - Jalin komunikasi baik dengan seller dan pengguna
3. 📊 **Data-Driven** - Gunakan data untuk membuat keputusan
4. 🔒 **Menjaga Privasi** - Hormati privasi dan data pengguna
5. 🚀 **Proaktif** - Antisipasi masalah sebelum menjadi besar


**Feedback & Saran:**

Panduan ini akan terus diperbarui seiring perkembangan platform. Jika Anda memiliki saran, pertanyaan, atau menemukan informasi yang kurang jelas, silakan hubungi tim pengembang.

**Kontak:**
- Email: [email-tim-pengembang]
- WhatsApp: [nomor-tim-pengembang]
- Dokumentasi Online: [link-dokumentasi]

---

**Versi Dokumen:** 1.0  
**Terakhir Diperbarui:** Januari 2025  
**Disusun oleh:** Tim Pengembang Platform PKM Hyperlocal UMKM  

---

© 2025 Platform PKM Hyperlocal UMKM. All rights reserved.
