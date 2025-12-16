<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;
use Laravel\WorkOS\User as WorkOSUser;

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
    try {
        $request->authenticate(
            createUsing: function (WorkOSUser $workosUser) {
                return User::create([
                    'name' => trim($workosUser->firstName . ' ' . $workosUser->lastName),
                    'email' => $workosUser->email,
                    'email_verified_at' => now(),
                    'workos_id' => $workosUser->id,
                    'avatar' => $workosUser->avatar ?? '',
                    'role' => User::ROLE_SELLER,
                ]);
            },
        );

        return to_route('dashboard');
    } catch (\Exception $e) {
        \Log::error('Auth error: ' . $e->getMessage());
        return redirect('/login')->with('error', 'Authentication failed. Please try again.');
    }
})->middleware(['guest']);

// Handle logout
Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth'])->name('logout');
