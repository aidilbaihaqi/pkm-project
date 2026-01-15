# Requirements Document

## Introduction

Dokumen ini berisi requirements untuk menyelesaikan PKM Hyperlocal UMKM Platform - sebuah aplikasi PWA yang menggabungkan konsep social media (reels/video pendek) dengan e-commerce lokal untuk mendukung digitalisasi UMKM. Aplikasi menampilkan konten UMKM berdasarkan lokasi pengguna dan transaksi dilakukan melalui WhatsApp.

## Glossary

- **System**: PKM Hyperlocal UMKM Platform
- **User**: Pengguna umum yang melihat konten (tidak perlu login)
- **Seller**: Pelaku UMKM yang mengunggah konten dan menjual produk
- **Admin**: Pengelola sistem yang melakukan moderasi
- **UMKM_Profile**: Profil toko UMKM yang berisi informasi bisnis
- **Reel**: Konten video/foto pendek yang dipromosikan oleh Seller
- **Feed**: Daftar konten yang ditampilkan berdasarkan lokasi
- **Engagement_Event**: Event tracking untuk view, like, share, click_wa
- **WhatsApp_CTA**: Tombol Call-to-Action yang mengarahkan ke WhatsApp

## Requirements

### Requirement 1: Manajemen Profil UMKM

**User Story:** As a Seller, I want to create and manage my UMKM profile, so that buyers can find my business information.

#### Acceptance Criteria

1. WHEN a Seller submits profile data, THE System SHALL create a new UMKM_Profile with nama_toko, nomor_wa, alamat, latitude, longitude, and kategori
2. WHEN a Seller updates their profile, THE System SHALL validate and save the updated UMKM_Profile data
3. WHEN a Seller requests their profile, THE System SHALL return the complete UMKM_Profile data
4. WHEN a User requests a specific UMKM profile by ID, THE System SHALL return the public UMKM_Profile data
5. IF a Seller submits invalid WhatsApp number format, THEN THE System SHALL return a validation error
6. IF a Seller submits coordinates outside valid range, THEN THE System SHALL return a validation error

### Requirement 2: Reels Content Management

**User Story:** As a Seller, I want to upload and manage video/photo content, so that I can promote my products to nearby users.

#### Acceptance Criteria

1. WHEN a Seller uploads a new reel with video URL, product name, caption, and category, THE System SHALL create a new Reel linked to their UMKM_Profile
2. WHEN a Seller updates their reel, THE System SHALL save the updated Reel data
3. WHEN a Seller deletes their reel, THE System SHALL remove the Reel from the system
4. WHEN a Seller requests their reels list, THE System SHALL return all Reels owned by that Seller with pagination
5. THE System SHALL validate that video URL is a valid YouTube URL format
6. THE System SHALL store thumbnail URL for each Reel

### Requirement 3: Location-Based Feed

**User Story:** As a User, I want to see UMKM content near my location, so that I can discover local products easily.

#### Acceptance Criteria

1. WHEN a User requests feed with latitude, longitude, and radius, THE System SHALL return Reels from UMKM within that radius
2. THE System SHALL sort feed results by distance (nearest first) and recency (newest first)
3. WHEN a User requests a specific reel by ID, THE System SHALL return the complete Reel data with UMKM information
4. THE System SHALL paginate feed results with configurable page size
5. IF no reels found within radius, THEN THE System SHALL return an empty list with appropriate message

### Requirement 4: WhatsApp CTA Integration

**User Story:** As a User, I want to contact UMKM via WhatsApp, so that I can inquire about products directly.

#### Acceptance Criteria

1. WHEN returning Reel data, THE System SHALL include a generated WhatsApp link with pre-filled message template
2. THE WhatsApp link SHALL include product name and UMKM name in the message template
3. WHEN a User clicks WhatsApp CTA, THE System SHALL log the click_wa engagement event

### Requirement 5: Engagement Tracking

**User Story:** As a Seller, I want to see statistics about my content, so that I can understand my audience reach.

#### Acceptance Criteria

1. WHEN a User views a reel, THE System SHALL record a view engagement event
2. WHEN a User likes a reel, THE System SHALL record a like engagement event
3. WHEN a User shares a reel, THE System SHALL record a share engagement event
4. WHEN a User clicks WhatsApp CTA, THE System SHALL record a click_wa engagement event
5. THE System SHALL throttle duplicate events from same user within 1 minute
6. WHEN a Seller requests statistics, THE System SHALL return aggregated view, like, share, and click_wa counts per reel

### Requirement 6: Admin Panel

**User Story:** As an Admin, I want to manage sellers and content, so that I can maintain platform quality.

#### Acceptance Criteria

1. WHEN an Admin requests seller list, THE System SHALL return all Sellers with their UMKM_Profile and statistics
2. WHEN an Admin blocks a seller, THE System SHALL mark the Seller as blocked and hide their content
3. WHEN an Admin unblocks a seller, THE System SHALL restore the Seller status and show their content
4. WHEN an Admin requests platform statistics, THE System SHALL return total users, sellers, reels, and engagement counts
5. THE System SHALL only allow Admin role to access admin endpoints

### Requirement 7: Video Upload Infrastructure

**User Story:** As a Seller, I want to upload videos easily, so that I can create content without technical complexity.

#### Acceptance Criteria

1. WHEN a Seller initiates video upload, THE System SHALL generate a pre-signed URL for direct upload to storage
2. THE System SHALL validate video file size does not exceed 100MB
3. THE System SHALL accept video formats: MP4, MOV, WebM
4. WHEN upload completes, THE System SHALL store the video URL and generate thumbnail
5. IF upload fails, THEN THE System SHALL return appropriate error message

### Requirement 8: Data Persistence

**User Story:** As a system architect, I want data to be properly stored and retrieved, so that the platform operates reliably.

#### Acceptance Criteria

1. THE System SHALL persist UMKM_Profile data to database with proper relationships
2. THE System SHALL persist Reel data with foreign key to UMKM_Profile
3. THE System SHALL persist Engagement_Event data with foreign keys to Reel and optional User
4. WHEN serializing data for API response, THE System SHALL encode using JSON format
5. FOR ALL valid data objects, serializing then deserializing SHALL produce equivalent objects (round-trip property)
