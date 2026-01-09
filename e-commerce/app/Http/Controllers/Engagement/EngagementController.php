<?php

namespace App\Http\Controllers\Engagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Engagement\RecordEventRequest;
use App\Models\Reel;
use App\Services\EngagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller for engagement tracking.
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 4.3
 */
class EngagementController extends Controller
{
    public function __construct(
        private EngagementService $engagementService
    ) {}

    /**
     * Record an engagement event for a reel.
     * Requirements: 5.1, 5.2, 5.3, 5.4, 4.3
     *
     * @param RecordEventRequest $request
     * @param int $reelId
     * @return JsonResponse
     */
    public function recordEvent(RecordEventRequest $request, int $reelId): JsonResponse
    {
        // Check if reel exists
        $reel = Reel::find($reelId);
        
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

        $eventType = $request->input('event_type');
        $userIdentifier = $request->getUserIdentifier();

        // Record the event (with throttling handled by service)
        $recorded = $this->engagementService->recordEvent(
            $reelId,
            $eventType,
            $userIdentifier
        );

        if (!$recorded) {
            return response()->json([
                'message' => 'Event sudah tercatat sebelumnya',
                'throttled' => true,
            ], 200);
        }

        return response()->json([
            'message' => 'Event berhasil dicatat',
            'data' => [
                'reel_id' => $reelId,
                'event_type' => $eventType,
            ],
        ], 201);
    }

    /**
     * Get engagement statistics for the authenticated seller.
     * Requirements: 5.6
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sellerStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->umkmProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Profile tidak ditemukan. Buat profile terlebih dahulu.',
            ], 404);
        }

        $stats = $this->engagementService->getStats($profile->id);
        $totalStats = $this->engagementService->getTotalStats($profile->id);

        return response()->json([
            'data' => [
                'summary' => $totalStats,
                'reels' => $stats,
            ],
        ]);
    }
}
