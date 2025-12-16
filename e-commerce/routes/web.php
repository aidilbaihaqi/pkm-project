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
    
    // TODO: Add more seller routes
    // Route::get('/profile', ...)->name('profile');
    // Route::get('/content', ...)->name('content');
    // Route::get('/upload', ...)->name('upload');
    // Route::get('/statistics', ...)->name('statistics');
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
    
    // TODO: Add more admin routes
    // Route::get('/users', ...)->name('users');
    // Route::get('/sellers', ...)->name('sellers');
    // Route::get('/content', ...)->name('content');
    // Route::get('/categories', ...)->name('categories');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
