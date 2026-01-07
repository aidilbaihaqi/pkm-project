<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Requests\Umkm\StoreProfileRequest;
use App\Http\Requests\Umkm\UpdateProfileRequest;
use App\Models\UmkmProfile;
use Illuminate\Http\JsonResponse;

class UmkmController extends Controller
{
    /**
     * Create a new UMKM profile for the authenticated seller.
     * Requirements: 1.1
     */
    public function store(StoreProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        // Check if user already has a profile
        if ($user->umkmProfile) {
            return response()->json([
                'message' => 'Profile already exists. Use update instead.',
            ], 422);
        }

        $profile = UmkmProfile::create([
            'user_id' => $user->id,
            ...$request->validated(),
        ]);

        return response()->json([
            'message' => 'Profile created successfully',
            'data' => $profile,
        ], 201);
    }

    /**
     * Update the authenticated seller's UMKM profile.
     * Requirements: 1.2
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->umkmProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found. Create one first.',
            ], 404);
        }

        $profile->update($request->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $profile->fresh(),
        ]);
    }

    /**
     * Get the authenticated seller's own UMKM profile.
     * Requirements: 1.3
     */
    public function show(): JsonResponse
    {
        $user = request()->user();
        $profile = $user->umkmProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'data' => $profile,
        ]);
    }

    /**
     * Get a public UMKM profile by ID.
     * Requirements: 1.4
     */
    public function showPublic(int $id): JsonResponse
    {
        $profile = UmkmProfile::where('id', $id)
            ->where('is_blocked', false)
            ->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'data' => $profile->only([
                'id',
                'nama_toko',
                'nomor_wa',
                'alamat',
                'latitude',
                'longitude',
                'kategori',
                'deskripsi',
                'avatar',
                'is_open',
                'open_hours',
            ]),
        ]);
    }
}
