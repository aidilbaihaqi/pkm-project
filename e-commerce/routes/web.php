<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

/*
|--------------------------------------------------------------------------
| Public Routes (Guest/User tanpa login)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public UMKM Profile
Route::get('/umkm/{id}', function ($id) {
    return Inertia::render('umkm/show', ['id' => $id]);
})->name('umkm.show');

// TEMP: Seller Profile (Public for Development)
Route::get('/seller/profile', function () {
    return Inertia::render('seller/profile/edit');
})->name('seller.profile');

Route::post('/seller/profile', function () {
    return redirect()->back()->with('success', 'Profil berhasil disimpan (Mock)');
})->name('seller.profile.update');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Seller Routes (Authenticated + Seller Role)
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
    // TODO: Add seller middleware
])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('seller/index');
    })->name('dashboard');

    // Seller Profile
    /* 
    Moved to public for temporary testing - see line 21
    Route::get('/profile', function () {
        return Inertia::render('seller/profile/edit');
    })->name('profile');
    
    Route::post('/profile', function () {
        // Mock update
        return redirect()->back()->with('success', 'Profil berhasil disimpan');
    })->name('profile.update');
    */
    
    // TODO: Add more seller routes
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Authenticated + Admin Role)
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
    // TODO: Add admin middleware
])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/index');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
