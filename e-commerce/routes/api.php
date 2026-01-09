<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Engagement\EngagementController;
use App\Http\Controllers\Reels\ReelsController;
use App\Http\Controllers\Umkm\UmkmController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes untuk REST API dengan prefix /api
|
*/

// Public routes
Route::get('/umkm/{id}', [UmkmController::class, 'showPublic']);
Route::get('/reels', [ReelsController::class, 'index']);
Route::get('/reels/{id}', [ReelsController::class, 'show']);

// Engagement events (public - can be recorded by anyone)
Route::post('/reels/{reelId}/events', [EngagementController::class, 'recordEvent']);

// Authenticated routes (Seller & Admin only - user biasa tidak perlu login)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Seller routes (seller & admin bisa akses)
    Route::middleware('role:seller,admin')->prefix('seller')->group(function () {
        // UMKM profile management
        Route::post('/profile', [UmkmController::class, 'store']);
        Route::put('/profile', [UmkmController::class, 'update']);
        Route::get('/profile', [UmkmController::class, 'show']);

        // Reels management
        Route::get('/reels', [ReelsController::class, 'sellerReels']);
        Route::post('/reels', [ReelsController::class, 'store']);
        Route::put('/reels/{reel}', [ReelsController::class, 'update']);
        Route::delete('/reels/{reel}', [ReelsController::class, 'destroy']);

        // Engagement statistics
        Route::get('/stats', [EngagementController::class, 'sellerStats']);
    });

    // Admin only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Admin panel endpoints
    });
});
