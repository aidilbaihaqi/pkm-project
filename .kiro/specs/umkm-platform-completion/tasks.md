# Implementation Plan: PKM Hyperlocal UMKM Platform Completion

## Overview

Plan implementasi untuk menyelesaikan backend API dan integrasi frontend PKM Hyperlocal UMKM Platform. Implementasi menggunakan Laravel (PHP) untuk backend dengan MySQL database.

## Tasks

- [x] 1. Database Migrations dan Models
  - [x] 1.1 Create migration untuk `umkm_profiles` table
    - Fields: user_id, nama_toko, nomor_wa, alamat, latitude, longitude, kategori, deskripsi, avatar, is_open, open_hours, is_blocked
    - Foreign key ke users table
    - _Requirements: 1.1, 8.1_
  - [x] 1.2 Create migration untuk `reels` table
    - Fields: umkm_profile_id, video_url, thumbnail_url, product_name, caption, price, kategori, type, status
    - Foreign key ke umkm_profiles table
    - _Requirements: 2.1, 8.2_
  - [x] 1.3 Create migration untuk `engagement_events` table
    - Fields: reel_id, user_identifier, event_type
    - Indexes untuk query optimization
    - _Requirements: 5.1, 8.3_
  - [x] 1.4 Create UmkmProfile model dengan relationships dan casts
    - _Requirements: 1.1, 8.1_
  - [x] 1.5 Create Reel model dengan relationships dan WhatsApp link accessor
    - _Requirements: 2.1, 4.1, 8.2_
  - [x] 1.6 Create EngagementEvent model dengan constants dan relationships
    - _Requirements: 5.1, 8.3_

- [x] 2. Checkpoint - Run migrations dan verify models
  - Ensure all migrations run successfully
  - Verify model relationships work correctly

- [x] 3. UMKM Profile API
  - [x] 3.1 Create StoreProfileRequest dengan validation rules
    - Validate nomor_wa format (08xx atau 628xx)
    - Validate latitude (-90 to 90) dan longitude (-180 to 180)
    - _Requirements: 1.5, 1.6_
  - [x] 3.2 Create UpdateProfileRequest dengan validation rules
    - _Requirements: 1.2_
  - [x] 3.3 Implement UmkmController@store untuk create profile
    - _Requirements: 1.1_
  - [x] 3.4 Implement UmkmController@update untuk update profile
    - _Requirements: 1.2_
  - [x] 3.5 Implement UmkmController@show untuk get own profile
    - _Requirements: 1.3_
  - [x] 3.6 Implement UmkmController@showPublic untuk get public profile
    - _Requirements: 1.4_
  - [x] 3.7 Write property test untuk Profile CRUD Consistency
    - **Property 1: Profile CRUD Consistency**
    - **Validates: Requirements 1.1, 1.3, 1.4**
  - [x] 3.8 Write property test untuk Profile Validation
    - **Property 2: Profile Validation Rejects Invalid Data**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 4. Checkpoint - Test UMKM Profile API
  - Ensure all profile endpoints work correctly
  - Verify validation rules

- [ ] 5. Reels Content API
  - [ ] 5.1 Create StoreReelRequest dengan YouTube URL validation
    - _Requirements: 2.5_
  - [ ] 5.2 Create UpdateReelRequest dengan validation rules
    - _Requirements: 2.2_
  - [ ] 5.3 Implement ReelsController@store untuk create reel
    - _Requirements: 2.1_
  - [ ] 5.4 Implement ReelsController@update untuk update reel
    - _Requirements: 2.2_
  - [ ] 5.5 Implement ReelsController@destroy untuk delete reel
    - _Requirements: 2.3_
  - [ ] 5.6 Implement ReelsController@sellerReels untuk list own reels
    - _Requirements: 2.4_
  - [ ] 5.7 Write property test untuk Reel CRUD Consistency
    - **Property 3: Reel CRUD Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
  - [ ] 5.8 Write property test untuk YouTube URL Validation
    - **Property 4: YouTube URL Validation**
    - **Validates: Requirements 2.5**

- [ ] 6. Checkpoint - Test Reels Content API
  - Ensure all reel CRUD endpoints work correctly

- [ ] 7. Location-Based Feed API
  - [ ] 7.1 Create LocationService untuk distance calculation (Haversine formula)
    - _Requirements: 3.1_
  - [ ] 7.2 Create FeedRequest dengan lat, lng, radius validation
    - _Requirements: 3.1_
  - [ ] 7.3 Implement ReelsController@index untuk location-based feed
    - Filter by radius, sort by distance dan recency
    - Include pagination
    - _Requirements: 3.1, 3.2, 3.4_
  - [ ] 7.4 Implement ReelsController@show untuk single reel dengan UMKM info
    - _Requirements: 3.3_
  - [ ] 7.5 Write property test untuk Location-Based Feed Filtering
    - **Property 5: Location-Based Feed Filtering**
    - **Validates: Requirements 3.1**
  - [ ] 7.6 Write property test untuk Feed Sorting Consistency
    - **Property 6: Feed Sorting Consistency**
    - **Validates: Requirements 3.2**

- [ ] 8. Checkpoint - Test Location-Based Feed
  - Ensure feed returns correct results based on location

- [ ] 9. WhatsApp CTA Integration
  - [ ] 9.1 Create WhatsAppService untuk generate link dengan message template
    - _Requirements: 4.1, 4.2_
  - [ ] 9.2 Add whatsapp_link accessor ke Reel model
    - _Requirements: 4.1_
  - [ ] 9.3 Write property test untuk WhatsApp Link Generation
    - **Property 7: WhatsApp Link Generation**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 10. Engagement Tracking API
  - [ ] 10.1 Create EngagementService dengan throttling logic
    - _Requirements: 5.5_
  - [ ] 10.2 Create RecordEventRequest dengan validation
    - _Requirements: 5.1_
  - [ ] 10.3 Implement EngagementController@recordEvent
    - Record view, like, share, click_wa events
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 4.3_
  - [ ] 10.4 Implement EngagementController@sellerStats
    - Aggregate counts per reel
    - _Requirements: 5.6_
  - [ ] 10.5 Write property test untuk Engagement Event Recording
    - **Property 8: Engagement Event Recording**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
  - [ ] 10.6 Write property test untuk Engagement Throttling
    - **Property 9: Engagement Throttling**
    - **Validates: Requirements 5.5**
  - [ ] 10.7 Write property test untuk Statistics Aggregation Accuracy
    - **Property 10: Statistics Aggregation Accuracy**
    - **Validates: Requirements 5.6**

- [ ] 11. Checkpoint - Test Engagement Tracking
  - Ensure events are recorded and throttled correctly

- [ ] 12. Admin Panel API
  - [ ] 12.1 Implement AdminController@sellers untuk list sellers
    - _Requirements: 6.1_
  - [ ] 12.2 Implement AdminController@blockSeller
    - _Requirements: 6.2_
  - [ ] 12.3 Implement AdminController@unblockSeller
    - _Requirements: 6.3_
  - [ ] 12.4 Implement AdminController@stats untuk platform statistics
    - _Requirements: 6.4_
  - [ ] 12.5 Add admin middleware ke admin routes
    - _Requirements: 6.5_
  - [ ] 12.6 Write property test untuk Seller Blocking Round-Trip
    - **Property 11: Seller Blocking Round-Trip**
    - **Validates: Requirements 6.2, 6.3**
  - [ ] 12.7 Write property test untuk Admin Authorization
    - **Property 12: Admin Authorization**
    - **Validates: Requirements 6.5**

- [ ] 13. Checkpoint - Test Admin Panel API
  - Ensure admin endpoints work correctly with proper authorization

- [ ] 14. API Routes Registration
  - [ ] 14.1 Register all API routes di routes/api.php
    - Group by middleware (auth, role)
    - _Requirements: All_

- [ ] 15. Frontend Integration
  - [ ] 15.1 Update VideoFeed component untuk fetch dari API
    - Replace mock data dengan API call
    - _Requirements: 3.1_
  - [ ] 15.2 Update Explore page untuk fetch dari API
    - _Requirements: 3.1_
  - [ ] 15.3 Update Upload page untuk submit ke API
    - _Requirements: 2.1_
  - [ ] 15.4 Update Content page untuk fetch dan manage reels dari API
    - _Requirements: 2.4_
  - [ ] 15.5 Update Seller Dashboard untuk fetch statistics dari API
    - _Requirements: 5.6_
  - [ ] 15.6 Update UMKM Show page untuk fetch dari API
    - _Requirements: 1.4_
  - [ ] 15.7 Update Admin Dashboard untuk fetch dari API
    - _Requirements: 6.1, 6.4_

- [ ] 16. Final Checkpoint - End-to-end testing
  - Ensure all features work together
  - Test complete user flows

- [ ] 17. Write property test untuk JSON Serialization Round-Trip
  - **Property 13: JSON Serialization Round-Trip**
  - **Validates: Requirements 8.4, 8.5**

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Frontend integration assumes existing UI components work correctly
- Property tests use PHPUnit with custom generators
