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
    // Public endpoints akan ditambahkan di sini
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);

    // Seller only routes
    Route::middleware('role:seller')->prefix('seller')->group(function () {
        // UMKM profile & reels management
    });

    // Admin only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Admin panel endpoints
    });
});
