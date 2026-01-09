<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EngagementEvent;
use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $totalUsers = User::count();
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
}
