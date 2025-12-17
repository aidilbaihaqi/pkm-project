<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;
use Laravel\WorkOS\User as WorkOSUser;
use Illuminate\Support\Facades\Auth;

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
        $user = $request->authenticate(
            createUsing: function (WorkOSUser $workosUser) {
                // Check if user already exists by email
                $existingUser = User::where('email', $workosUser->email)->first();
                
                if ($existingUser) {
                    // Update existing user with WorkOS info
                    $existingUser->update([
                        'workos_id' => $workosUser->id,
                        'avatar' => $workosUser->avatar ?? $existingUser->avatar,
                    ]);
                    return $existingUser;
                }
                
                // Create new user
                return User::create([
                    'name' => trim($workosUser->firstName . ' ' . $workosUser->lastName),
                    'email' => $workosUser->email,
                    'email_verified_at' => now(),
                    'workos_id' => $workosUser->id,
                    'avatar' => $workosUser->avatar ?? '',
                    'role' => User::ROLE_SELLER,
                ]);
            },
            updateUsing: function (User $user, WorkOSUser $workosUser) {
                $user->update([
                    'name' => trim($workosUser->firstName . ' ' . $workosUser->lastName),
                    'avatar' => $workosUser->avatar ?? $user->avatar,
                ]);
                return $user;
            },
        );

        // Log untuk debugging
        \Log::info('User authenticated successfully', ['user_id' => Auth::id(), 'user' => Auth::user()?->toArray()]);

        // Redirect seller ke halaman home dengan full page reload
        return Inertia::location('/');
    } catch (\Exception $e) {
        \Log::error('Auth error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        return redirect('/login')->with('error', 'Authentication failed. Please try again.');
    }
})->name('authenticate');

// Handle logout
Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout('/');
})->middleware(['auth'])->name('logout');
