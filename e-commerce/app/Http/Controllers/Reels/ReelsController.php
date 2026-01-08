<?php

namespace App\Http\Controllers\Reels;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reels\StoreReelRequest;
use App\Http\Requests\Reels\UpdateReelRequest;
use App\Models\Reel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReelsController extends Controller
{
    /**
     * Create a new reel for the authenticated seller.
     * Requirements: 2.1
     */
    public function store(StoreReelRequest $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->umkmProfile;

        $reel = Reel::create([
            'umkm_profile_id' => $profile->id,
            ...$request->validated(),
        ]);

        return response()->json([
            'message' => 'Reel created successfully',
            'data' => $reel->load('umkmProfile'),
        ], 201);
    }

    /**
     * Update an existing reel.
     * Requirements: 2.2
     */
    public function update(UpdateReelRequest $request, int $reel): JsonResponse
    {
        $reelModel = Reel::findOrFail($reel);
        
        $reelModel->update($request->validated());

        return response()->json([
            'message' => 'Reel updated successfully',
            'data' => $reelModel->fresh()->load('umkmProfile'),
        ]);
    }

    /**
     * Delete a reel.
     * Requirements: 2.3
     */
    public function destroy(Request $request, int $reel): JsonResponse
    {
        $user = $request->user();
        $reelModel = Reel::findOrFail($reel);

        // Check ownership
        if (!$user->umkmProfile || $reelModel->umkm_profile_id !== $user->umkmProfile->id) {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $reelModel->delete();

        return response()->json([
            'message' => 'Reel deleted successfully',
        ]);
    }

    /**
     * Get all reels owned by the authenticated seller with pagination.
     * Requirements: 2.4
     */
    public function sellerReels(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->umkmProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found. Create one first.',
            ], 404);
        }

        $perPage = $request->input('per_page', 15);
        $reels = Reel::where('umkm_profile_id', $profile->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $reels->items(),
            'meta' => [
                'current_page' => $reels->currentPage(),
                'last_page' => $reels->lastPage(),
                'per_page' => $reels->perPage(),
                'total' => $reels->total(),
            ],
        ]);
    }
}
