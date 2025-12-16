<?php

use App\Http\Controllers\Auth\AuthController;
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
Route::middleware('guest')->group(function () {
    // Public endpoints akan ditambahkan di sini (feed reels, dll)
});

// Authenticated routes (Seller & Admin only - user biasa tidak perlu login)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Seller routes (seller & admin bisa akses)
    Route::middleware('role:seller,admin')->prefix('seller')->group(function () {
        // UMKM profile & reels management
    });

    // Admin only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Admin panel endpoints
    });
});
