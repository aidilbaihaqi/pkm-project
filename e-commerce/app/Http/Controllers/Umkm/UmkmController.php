<?php

namespace App\Http\Controllers\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Requests\Umkm\StoreProfileRequest;
use App\Http\Requests\Umkm\UpdateProfileRequest;
use App\Models\UmkmProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $data = $request->validated();
        
        // Handle avatar upload if base64
        if (!empty($data['avatar']) && str_starts_with($data['avatar'], 'data:image')) {
            $data['avatar'] = $this->saveBase64Image($data['avatar'], 'avatars');
        }

        $profile = UmkmProfile::create([
            'user_id' => $user->id,
            ...$data,
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

        $data = $request->validated();
        
        // Handle avatar upload if base64
        if (!empty($data['avatar']) && str_starts_with($data['avatar'], 'data:image')) {
            // Delete old avatar if exists
            if ($profile->avatar && Storage::disk('public')->exists(str_replace('/storage/', '', $profile->avatar))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $profile->avatar));
            }
            $data['avatar'] = $this->saveBase64Image($data['avatar'], 'avatars');
        }

        $profile->update($data);

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

    /**
     * Save base64 image to storage and return the public path.
     */
    private function saveBase64Image(string $base64Image, string $folder): string
    {
        // Extract the image data
        preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches);
        $extension = $matches[1] ?? 'png';
        
        // Remove the data:image/xxx;base64, part
        $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $base64Image);
        $imageData = base64_decode($imageData);
        
        // Generate unique filename
        $filename = $folder . '/' . Str::uuid() . '.' . $extension;
        
        // Store the image
        Storage::disk('public')->put($filename, $imageData);
        
        return '/storage/' . $filename;
    }
}
