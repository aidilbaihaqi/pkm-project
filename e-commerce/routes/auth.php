<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;
use Laravel\WorkOS\User as WorkOSUser;

Route::get('login', function (AuthKitLoginRequest $request) {
    return $request->redirect();
})->middleware(['guest'])->name('login');

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

Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth'])->name('logout');
