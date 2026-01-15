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

use App\Models\EngagementEvent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            // Standard location-based feed or global fallback
            $lat = (float) $request->input('lat');
            $lng = (float) $request->input('lng');
            $radius = $request->getRadius();
            $perPage = $request->getPerPage();
            $page = $request->getPage();
    
            // If coordinates are missing (0,0), return global feed sorted by latest
            if ($lat == 0 && $lng == 0) {
                $reels = Reel::with('umkmProfile')
                    ->whereHas('umkmProfile', function($q) {
                        $q->where('is_blocked', false);
                    })
                    ->where('status', 'published')
                    ->latest()
                    ->paginate($perPage, ['*'], 'page', $page);

                $result = [
                    'data' => collect($reels->items()),
                    'meta' => [
                        'current_page' => $reels->currentPage(),
                        'last_page' => $reels->lastPage(),
                        'per_page' => $reels->perPage(),
                        'total' => $reels->total(),
                    ],
                ];

                // Set distance to 0 for global feed
                $result['data']->transform(function ($reel) {
                    $reel->distance = 0;
                    return $reel;
                });
            } else {
                $result = $this->locationService->getReelsWithinRadius(
                    $lat,
                    $lng,
                    $radius,
                    $perPage,
                    $page
                );
            }
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
                'images' => $reel->images,
                'status' => $reel->status,
                'whatsapp_link' => $reel->whatsapp_link,
                'views_count' => $reel->views_count,
                'likes_count' => $reel->likes_count,
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

        // Add is_liked status efficiently
        $userIdentifier = $this->getUserIdentifier($request);
        $reelIds = $data->pluck('id');
        $likedReelIds = EngagementEvent::whereIn('reel_id', $reelIds)
            ->where('event_type', EngagementEvent::TYPE_LIKE)
            ->where('user_identifier', $userIdentifier)
            ->pluck('reel_id')
            ->flip()
            ->toArray();

        $data->transform(function ($item) use ($likedReelIds) {
            $item['is_liked'] = isset($likedReelIds[$item['id']]);
            return $item;
        });

        if ($data->isEmpty()) {
            // Fallback: If no reels in radius, return global feed
            $reels = Reel::with('umkmProfile')
                ->whereHas('umkmProfile', function($q) {
                    $q->where('is_blocked', false);
                })
                ->where('status', 'published')
                ->latest()
                ->paginate($request->getPerPage(), ['*'], 'page', $request->getPage());

            $globalData = collect($reels->items())->map(function ($reel) {
                 return [
                    'id' => $reel->id,
                    'video_url' => $reel->video_url,
                    'thumbnail_url' => $reel->thumbnail_url,
                    'product_name' => $reel->product_name,
                    'caption' => $reel->caption,
                    'price' => $reel->price,
                    'kategori' => $reel->kategori,
                    'type' => $reel->type,
                    'images' => $reel->images,
                    'status' => $reel->status,
                    'whatsapp_link' => $reel->whatsapp_link,
                    'views_count' => $reel->views_count,
                    'likes_count' => $reel->likes_count,
                    'distance_km' => 0,
                    'distance' => 0,
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

            // Add is_liked status efficiently for global feed
            $userIdentifier = $this->getUserIdentifier($request);
            $reelIds = $globalData->pluck('id');
            $likedReelIds = EngagementEvent::whereIn('reel_id', $reelIds)
                ->where('event_type', EngagementEvent::TYPE_LIKE)
                ->where('user_identifier', $userIdentifier)
                ->pluck('reel_id')
                ->flip()
                ->toArray();

            $globalData->transform(function ($item) use ($likedReelIds) {
                $item['is_liked'] = isset($likedReelIds[$item['id']]);
                return $item;
            });

            return response()->json([
                'message' => 'Menampilkan konten terbaru (di luar radius)',
                'data' => $globalData,
                'meta' => [
                    'current_page' => $reels->currentPage(),
                    'last_page' => $reels->lastPage(),
                    'per_page' => $reels->perPage(),
                    'total' => $reels->total(),
                ],
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
                'images' => $reel->images,
                'status' => $reel->status,
                'whatsapp_link' => $reel->whatsapp_link,
                'views_count' => $reel->views_count,
                'likes_count' => $reel->likes_count,
                'is_liked' => $this->checkIfLiked($reel->id, $request),
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

        $data = $request->validated();

        // Handle images array
        if (isset($data['images']) && is_array($data['images'])) {
            $processedImages = [];
            foreach ($data['images'] as $image) {
                if (!empty($image) && str_starts_with($image, 'data:image')) {
                    $processedImages[] = $this->saveBase64Image($image, 'reels');
                } else {
                    $processedImages[] = $image;
                }
            }
            $data['images'] = $processedImages;
        }

        $reel = Reel::create([
            'umkm_profile_id' => $profile->id,
            ...$data,
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
        
        $data = $request->validated();

        // Handle images array
        if (isset($data['images']) && is_array($data['images'])) {
            $processedImages = [];
            foreach ($data['images'] as $image) {
                if (!empty($image) && str_starts_with($image, 'data:image')) {
                    $processedImages[] = $this->saveBase64Image($image, 'reels');
                } else {
                    $processedImages[] = $image;
                }
            }
            $data['images'] = $processedImages;
        }
        
        $reelModel->update($data);

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

        // Map reels to include is_liked status
        $data = collect($reels->items())->map(function ($reel) use ($request) {
            $reel->is_liked = $this->checkIfLiked($reel->id, $request);
            return $reel;
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $reels->currentPage(),
                'last_page' => $reels->lastPage(),
                'per_page' => $reels->perPage(),
                'total' => $reels->total(),
            ],
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

    /**
     * Get user identifier for engagement tracking.
     */
    private function getUserIdentifier(Request $request): string
    {
        $user = $request->user();
        if ($user) {
            return 'user:' . $user->id;
        }
        return 'ip:' . $request->ip();
    }

    /**
     * Check if a single reel is liked by current user.
     */
    private function checkIfLiked(int $reelId, Request $request): bool
    {
        return EngagementEvent::where('reel_id', $reelId)
            ->where('event_type', EngagementEvent::TYPE_LIKE)
            ->where('user_identifier', $this->getUserIdentifier($request))
            ->exists();
    }
}
