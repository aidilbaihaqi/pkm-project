<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\EngagementEvent;
use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * List all sellers with their UMKM profiles and statistics.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sellers(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        
        $sellers = User::where('role', User::ROLE_SELLER)
            ->with(['umkmProfile' => function ($query) {
                $query->withCount('reels');
            }])
            ->paginate($perPage);

        // Add engagement statistics for each seller
        $sellers->getCollection()->transform(function ($seller) {
            $stats = [
                'total_views' => 0,
                'total_likes' => 0,
                'total_shares' => 0,
                'total_click_wa' => 0,
            ];

            if ($seller->umkmProfile) {
                $reelIds = $seller->umkmProfile->reels()->pluck('id');
                
                if ($reelIds->isNotEmpty()) {
                    $engagementCounts = EngagementEvent::whereIn('reel_id', $reelIds)
                        ->selectRaw('event_type, COUNT(*) as count')
                        ->groupBy('event_type')
                        ->pluck('count', 'event_type');

                    $stats = [
                        'total_views' => $engagementCounts->get(EngagementEvent::TYPE_VIEW, 0),
                        'total_likes' => $engagementCounts->get(EngagementEvent::TYPE_LIKE, 0),
                        'total_shares' => $engagementCounts->get(EngagementEvent::TYPE_SHARE, 0),
                        'total_click_wa' => $engagementCounts->get(EngagementEvent::TYPE_CLICK_WA, 0),
                    ];
                }
            }

            $seller->statistics = $stats;
            return $seller;
        });

        return response()->json([
            'data' => $sellers->items(),
            'meta' => [
                'current_page' => $sellers->currentPage(),
                'last_page' => $sellers->lastPage(),
                'per_page' => $sellers->perPage(),
                'total' => $sellers->total(),
            ],
        ]);
    }


    /**
     * Block a seller and hide their content.
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function blockSeller(int $id): JsonResponse
    {
        $seller = User::where('role', User::ROLE_SELLER)->findOrFail($id);
        
        if (!$seller->umkmProfile) {
            return response()->json([
                'message' => 'Seller does not have a UMKM profile.',
            ], 404);
        }

        $seller->umkmProfile->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'Seller has been blocked successfully.',
            'data' => [
                'id' => $seller->id,
                'name' => $seller->name,
                'is_blocked' => true,
            ],
        ]);
    }

    /**
     * Unblock a seller and restore their content visibility.
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function unblockSeller(int $id): JsonResponse
    {
        $seller = User::where('role', User::ROLE_SELLER)->findOrFail($id);
        
        if (!$seller->umkmProfile) {
            return response()->json([
                'message' => 'Seller does not have a UMKM profile.',
            ], 404);
        }

        $seller->umkmProfile->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'Seller has been unblocked successfully.',
            'data' => [
                'id' => $seller->id,
                'name' => $seller->name,
                'is_blocked' => false,
            ],
        ]);
    }

    /**
     * Get platform statistics.
     * 
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        $totalUsers = User::where('role', '!=', 'admin')->count();
        $totalSellers = User::where('role', User::ROLE_SELLER)->count();
        $totalReels = Reel::count();
        
        $engagementCounts = EngagementEvent::selectRaw('event_type, COUNT(*) as count')
            ->groupBy('event_type')
            ->pluck('count', 'event_type');

        return response()->json([
            'data' => [
                'total_users' => $totalUsers,
                'total_sellers' => $totalSellers,
                'total_reels' => $totalReels,
                'engagement' => [
                    'total_views' => $engagementCounts->get(EngagementEvent::TYPE_VIEW, 0),
                    'total_likes' => $engagementCounts->get(EngagementEvent::TYPE_LIKE, 0),
                    'total_shares' => $engagementCounts->get(EngagementEvent::TYPE_SHARE, 0),
                    'total_click_wa' => $engagementCounts->get(EngagementEvent::TYPE_CLICK_WA, 0),
                ],
            ],
        ]);
    }

    /**
     * Get trend statistics for charts.
     * 
     * @return JsonResponse
     */
    public function trendStats(): JsonResponse
    {
        // Daily engagement for last 7 days
        $dailyEngagement = EngagementEvent::selectRaw('DATE(created_at) as date, event_type, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date', 'event_type')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($events, $date) {
                return [
                    'date' => $date,
                    'views' => $events->where('event_type', EngagementEvent::TYPE_VIEW)->first()?->count ?? 0,
                    'likes' => $events->where('event_type', EngagementEvent::TYPE_LIKE)->first()?->count ?? 0,
                    'shares' => $events->where('event_type', EngagementEvent::TYPE_SHARE)->first()?->count ?? 0,
                    'wa_clicks' => $events->where('event_type', EngagementEvent::TYPE_CLICK_WA)->first()?->count ?? 0,
                ];
            })
            ->values();

        // Top 5 sellers by views
        $topSellers = User::where('role', User::ROLE_SELLER)
            ->whereHas('umkmProfile')
            ->with('umkmProfile')
            ->get()
            ->map(function ($seller) {
                $reelIds = $seller->umkmProfile->reels()->pluck('id');
                $views = EngagementEvent::whereIn('reel_id', $reelIds)
                    ->where('event_type', EngagementEvent::TYPE_VIEW)
                    ->count();
                $likes = EngagementEvent::whereIn('reel_id', $reelIds)
                    ->where('event_type', EngagementEvent::TYPE_LIKE)
                    ->count();
                return [
                    'id' => $seller->id,
                    'name' => $seller->name,
                    'umkm_name' => $seller->umkmProfile->nama_toko,
                    'views' => $views,
                    'likes' => $likes,
                    'reels_count' => $reelIds->count(),
                ];
            })
            ->sortByDesc('views')
            ->take(5)
            ->values();

        // New content per day (last 7 days)
        $contentGrowth = Reel::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'data' => [
                'daily_engagement' => $dailyEngagement,
                'top_sellers' => $topSellers,
                'content_growth' => $contentGrowth,
            ],
        ]);
    }

    // --- Category Management ---

    public function categories(Request $request): JsonResponse
    {
        $categories = Category::orderBy('name')->get();
        return response()->json(['data' => $categories]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ]);
    }

    public function updateCategory(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function deleteCategory($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    // --- Moderation ---

    public function moderation(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 12);
        
        $reels = Reel::with(['umkmProfile.user'])
            ->latest()
            ->paginate($perPage);
            
        return response()->json([
            'data' => $reels->items(),
            'meta' => [
                'current_page' => $reels->currentPage(),
                'last_page' => $reels->lastPage(),
                'total' => $reels->total(),
            ]
        ]);
    }

    public function blockReel(Request $request, $id): JsonResponse
    {
        $reel = Reel::findOrFail($id);
        
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);
        
        $reel->update([
            'is_blocked' => true,
            'blocked_reason' => $validated['reason'] ?? 'Melanggar kebijakan konten',
            'blocked_at' => now(),
        ]);

        return response()->json([
            'message' => 'Konten berhasil diblokir',
            'data' => $reel
        ]);
    }

    public function unblockReel($id): JsonResponse
    {
        $reel = Reel::findOrFail($id);
        
        $reel->update([
            'is_blocked' => false,
            'blocked_reason' => null,
            'blocked_at' => null,
        ]);

        return response()->json([
            'message' => 'Konten berhasil dibuka blokirnya',
            'data' => $reel
        ]);
    }

    public function deleteReel($id): JsonResponse
    {
        $reel = Reel::findOrFail($id);
        // Optional: Delete physical file if needed
        $reel->delete();

        return response()->json(['message' => 'Video content removed successfully']);
    }
}
