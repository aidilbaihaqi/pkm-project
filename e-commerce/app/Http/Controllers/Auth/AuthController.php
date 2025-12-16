<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Get authenticated user info.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->only(['id', 'name', 'email', 'role', 'avatar']),
        ]);
    }
}
