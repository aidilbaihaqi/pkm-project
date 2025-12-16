<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;

// Show login page
Route::get('login', function () {
    return Inertia::render('auth/login');
})->middleware(['guest'])->name('login');

// Handle login redirect to WorkOS
Route::get('login/redirect', function (AuthKitLoginRequest $request) {
    return $request->redirect();
})->middleware(['guest'])->name('login.redirect');

// Handle authentication callback from WorkOS
Route::get('authenticate', function (AuthKitAuthenticationRequest $request) {
    return tap(to_route('dashboard'), fn () => $request->authenticate());
})->middleware(['guest']);

// Handle logout
Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth'])->name('logout');
