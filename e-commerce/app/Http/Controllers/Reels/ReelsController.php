<?php

namespace App\Http\Controllers\Reels;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reels\FeedRequest;
use App\Http\Requests\Reels\StoreReelRequest;
use App\Http\Requests\Reels\UpdateReelRequest;
use App\Models\Reel;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReelsController extends Controller
{
    public function __construct(
        private LocationService $locationService
    ) {}

    /**
     * Get location-based feed of reels.
     * Requirements: 3.1, 3.2, 3.4
     */
    public function index(FeedRequest $request): JsonResponse
    {
        // Check if fetching for specific UMKM (bypass location filter)
        if ($request->has('umkm_id')) {
            $umkmId = $request->input('umkm_id');
            $perPage = $request->getPerPage();
            
            $reels = Reel::with('umkmProfile')
                ->where('umkm_profile_id', $umkmId)
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $result = [
                'data' => collect($reels->items()),
                'meta' => [
                    'current_page' => $reels->currentPage(),
                    'last_page' => $reels->lastPage(),
                    'per_page' => $reels->perPage(),
                    'total' => $reels->total(),
                ],
            ];
            
            // Set distance to 0 for specific UMKM view as it's not relevant
            $result['data']->transform(function ($reel) {
                $reel->distance = 0;
                return $reel;
            });
        } else {
            // Standard location-based feed
            $lat = (float) $request->input('lat');
            $lng = (float) $request->input('lng');
            $radius = $request->getRadius();
            $perPage = $request->getPerPage();
            $page = $request->getPage();
    
            $result = $this->locationService->getReelsWithinRadius(
                $lat,
                $lng,
                $radius,
                $perPage,
                $page
            );
        }

        // Transform data to include distance in response
        $data = $result['data']->map(function ($reel) {
            return [
                'id' => $reel->id,
                'video_url' => $reel->video_url,
                'thumbnail_url' => $reel->thumbnail_url,
                'product_name' => $reel->product_name,
                'caption' => $reel->caption,
                'price' => $reel->price,
                'kategori' => $reel->kategori,
                'type' => $reel->type,
                'status' => $reel->status,
                'whatsapp_link' => $reel->whatsapp_link,
                'views_count' => $reel->views_count,
                'distance_km' => round($reel->distance, 2),
                'distance' => round($reel->distance * 1000), // in meters for sidebar
                'created_at' => $reel->created_at,
                'umkm_profile_id' => $reel->umkm_profile_id,
                'umkm_profile' => [
                    'id' => $reel->umkmProfile->id,
                    'nama_toko' => $reel->umkmProfile->nama_toko,
                    'kategori' => $reel->umkmProfile->kategori,
                    'avatar' => $reel->umkmProfile->avatar,
                    'is_open' => $reel->umkmProfile->is_open,
                ],
            ];
        });

        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada konten UMKM dalam radius yang ditentukan',
                'data' => [],
                'meta' => $result['meta'],
            ]);
        }

        return response()->json([
            'data' => $data,
            'meta' => $result['meta'],
        ]);
    }

    /**
     * Get a single reel with UMKM information.
     * Requirements: 3.3
     */
    public function show(int $id): JsonResponse
    {
        $reel = Reel::with('umkmProfile')->find($id);

        if (!$reel) {
            return response()->json([
                'message' => 'Reel tidak ditemukan',
            ], 404);
        }

        // Check if UMKM is blocked
        if ($reel->umkmProfile && $reel->umkmProfile->is_blocked) {
            return response()->json([
                'message' => 'Konten tidak tersedia',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $reel->id,
                'video_url' => $reel->video_url,
                'thumbnail_url' => $reel->thumbnail_url,
                'product_name' => $reel->product_name,
                'caption' => $reel->caption,
                'price' => $reel->price,
                'kategori' => $reel->kategori,
                'type' => $reel->type,
                'status' => $reel->status,
                'whatsapp_link' => $reel->whatsapp_link,
                'created_at' => $reel->created_at,
                'updated_at' => $reel->updated_at,
                'umkm_profile' => $reel->umkmProfile ? [
                    'id' => $reel->umkmProfile->id,
                    'nama_toko' => $reel->umkmProfile->nama_toko,
                    'nomor_wa' => $reel->umkmProfile->nomor_wa,
                    'alamat' => $reel->umkmProfile->alamat,
                    'latitude' => $reel->umkmProfile->latitude,
                    'longitude' => $reel->umkmProfile->longitude,
                    'kategori' => $reel->umkmProfile->kategori,
                    'deskripsi' => $reel->umkmProfile->deskripsi,
                    'avatar' => $reel->umkmProfile->avatar,
                    'is_open' => $reel->umkmProfile->is_open,
                    'open_hours' => $reel->umkmProfile->open_hours,
                ] : null,
            ],
        ]);
    }
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
