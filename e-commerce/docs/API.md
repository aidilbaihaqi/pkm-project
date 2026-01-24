# API Documentation - PKM Hyperlocal UMKM Platform

Base URL: `http://127.0.0.1:8000`

---

## Authentication

Aplikasi menggunakan **WorkOS AuthKit** dengan Google OAuth. User biasa (pembeli) tidak perlu login, login hanya untuk **Seller** dan **Admin**.

### Flow Login

```
1. Frontend redirect ke: GET /login
2. User login via Google (WorkOS hosted UI)
3. WorkOS redirect ke: GET /authenticate?code=xxx
4. Backend create/update user, set session
5. Redirect ke dashboard atau frontend callback
```

### Endpoints

#### 1. Login (Redirect ke Google OAuth)

```
GET /login
```

**Response:** Redirect ke WorkOS/Google OAuth

**Usage di Frontend:**
```javascript
// Redirect user ke login
window.location.href = 'http://127.0.0.1:8000/login';
```

---

#### 2. Logout

```
POST /logout
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
X-XSRF-TOKEN: {csrf_token}
```

**Response:** Redirect ke home atau JSON response

---

## API Endpoints (Prefix: `/api`)

Semua API endpoints memerlukan authentication via session cookie.

### Headers untuk API Request

```
Accept: application/json
Content-Type: application/json
X-XSRF-TOKEN: {csrf_token}
```

---

### Auth

#### Get Current User

```
GET /api/me
```

**Auth Required:** Yes (Seller/Admin)

**Response Success (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seller",
    "avatar": "https://...",
    "is_seller": true,
    "is_admin": false
  }
}
```

**Response Unauthorized (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

#### Logout (API)

```
POST /api/logout
```

**Auth Required:** Yes

**Response Success (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Roles & Permissions

| Role | Deskripsi | Akses |
|------|-----------|-------|
| `seller` | UMKM/Penjual | Kelola profil toko, upload reels, lihat statistik |
| `admin` | Administrator | Semua akses seller + moderasi, kelola kategori |

### Middleware

- `role:seller,admin` - Hanya seller dan admin
- `role:admin` - Hanya admin

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 429 Too Many Requests
```json
{
  "message": "Too Many Attempts."
}
```

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| API (default) | 60 requests/minute |
| Login | 5 requests/minute |
| Upload | 10 requests/minute |
| Events | 100 requests/minute |

---

## CORS

Allowed origins:
- `http://localhost:3000`
- `http://127.0.0.1:8000`
- `http://localhost:8000`

---

## Testing dengan Postman

### Setup

1. Buka browser, akses `http://127.0.0.1:8000/login`
2. Login dengan Google
3. Setelah login, buka DevTools → Application → Cookies
4. Copy cookies: `laravel_session`, `XSRF-TOKEN`

### Di Postman

1. Set cookies di Postman untuk domain `127.0.0.1`
2. Tambahkan header:
   - `Accept: application/json`
   - `X-XSRF-TOKEN: {nilai XSRF-TOKEN, URL decoded}`
   - `Referer: http://127.0.0.1:8000`

---

## Endpoints yang Akan Datang

### Task 2: Manajemen Profil UMKM
- `POST /api/seller/profile` - Buat profil toko
- `PUT /api/seller/profile` - Update profil toko
- `GET /api/seller/profile` - Get profil toko sendiri
- `GET /api/umkm/{id}` - Get profil UMKM (public)

### Task 3: Reels & Feed
- `GET /api/reels?lat&lng&radius&page` - Feed reels (public)
- `GET /api/reels/{id}` - Detail reels (public)
- `POST /api/seller/reels` - Upload reels
- `PUT /api/seller/reels/{id}` - Update reels
- `DELETE /api/seller/reels/{id}` - Hapus reels

### Task 4: WhatsApp CTA
- WhatsApp link generator (di response reels)

### Task 5: Upload Video
- `POST /api/seller/uploads/video/init` - Init upload (get pre-signed URL)


---

## Search API

### Search UMKM & Reels

```
GET /api/search?q={query}
```

**Auth Required:** No (Public)

**Query Parameters:**
- `q` (required): Search query string
- `type` (optional): Filter by type (`all`, `umkm`, `reels`)
- `kategori` (optional): Filter by category

**Example Request:**
```
GET /api/search?q=bakso
```

**Response Success (200):**
```json
{
  "umkm": [
    {
      "id": 1,
      "nama_toko": "Bakso Pak Joko",
      "kategori": "Makanan",
      "alamat": "Jl. Basuki Rahmat No. 78, Tanjungpinang",
      "avatar": "https://...",
      "is_open": true,
      "deskripsi": "Bakso urat jumbo dengan kuah kaldu sapi pilihan..."
    }
  ],
  "reels": [
    {
      "id": 1,
      "product_name": "Bakso Urat Jumbo",
      "caption": "Bakso urat jumbo sebesar kepalan tangan!...",
      "price": 20000,
      "thumbnail_url": "https://...",
      "kategori": "Makanan",
      "umkm": {
        "id": 1,
        "nama_toko": "Bakso Pak Joko",
        "avatar": "https://..."
      }
    }
  ],
  "total": 2
}
```

---

### Get Search Suggestions

```
GET /api/search/suggestions?q={query}
```

**Auth Required:** No (Public)

**Query Parameters:**
- `q` (optional): Partial search query for autocomplete

**Example Request:**
```
GET /api/search/suggestions?q=bak
```

**Response Success (200):**
```json
{
  "suggestions": [
    "Bakso Urat Jumbo",
    "Bakso Beranak",
    "Bakso Pak Joko",
    "Makanan"
  ]
}
```

**Example Request (No Query - Get Popular):**
```
GET /api/search/suggestions
```

**Response Success (200):**
```json
{
  "suggestions": [
    "Makanan",
    "Minuman",
    "Fashion",
    "Kerajinan",
    "Gudeg Komplit",
    "Bakso Urat Jumbo",
    "Batik Tulis Melayu",
    "Kopi Gayo V60"
  ]
}
```

---

## Search Features

### Frontend Features
- ✅ Real-time search with debouncing (500ms)
- ✅ Search history stored in localStorage
- ✅ Dynamic suggestions based on query
- ✅ Search results display (UMKM stores & Products)
- ✅ Clear search history
- ✅ Recent searches display
- ✅ Loading states

### Backend Features
- ✅ Full-text search in UMKM profiles (nama_toko, kategori, deskripsi, alamat)
- ✅ Full-text search in Reels (product_name, caption, kategori)
- ✅ Dynamic suggestions based on existing data
- ✅ Popular suggestions when no query provided
- ✅ Results pagination ready (limit 10 UMKM, 20 Reels)
