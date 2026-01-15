<?php

namespace App\Services;

use App\Models\EngagementEvent;
use App\Models\Reel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Service for managing engagement events with throttling logic.
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */
class EngagementService
{
    /**
     * Throttle window in seconds (1 minute).
     */
    private const THROTTLE_WINDOW_SECONDS = 60;

    /**
     * Record an engagement event with throttling.
     *
     * @param int $reelId The reel ID
     * @param string $eventType The event type (view, like, share, click_wa)
     * @param string|null $userIdentifier User identifier (IP, session, or user ID)
     * @return bool True if event was recorded, false if throttled
     */
    public function recordEvent(int $reelId, string $eventType, ?string $userIdentifier): bool
    {
        // Validate event type
        if (!in_array($eventType, EngagementEvent::VALID_TYPES)) {
            return false;
        }

        // Check throttling if user identifier is provided
        if ($userIdentifier && $this->shouldThrottle($reelId, $eventType, $userIdentifier)) {
            return false;
        }

        // Create the engagement event
        EngagementEvent::create([
            'reel_id' => $reelId,
            'event_type' => $eventType,
            'user_identifier' => $userIdentifier,
            'created_at' => now(),
        ]);

        return true;
    }

    /**
     * Check if an event should be throttled.
     * Duplicate events from same user within 1 minute should be throttled.
     *
     * @param int $reelId The reel ID
     * @param string $eventType The event type
     * @param string $userIdentifier User identifier
     * @return bool True if should throttle, false otherwise
     */
    public function shouldThrottle(int $reelId, string $eventType, string $userIdentifier): bool
    {
        $throttleTime = Carbon::now()->subSeconds(self::THROTTLE_WINDOW_SECONDS);

        return EngagementEvent::where('reel_id', $reelId)
            ->where('event_type', $eventType)
            ->where('user_identifier', $userIdentifier)
            ->where('created_at', '>=', $throttleTime)
            ->exists();
    }

    /**
     * Toggle like status for a reel.
     *
     * @param int $reelId
     * @param string $userIdentifier
     * @return array Result with is_liked status
     */
    public function toggleLike(int $reelId, string $userIdentifier): array
    {
        $existingLike = EngagementEvent::where('reel_id', $reelId)
            ->where('event_type', EngagementEvent::TYPE_LIKE)
            ->where('user_identifier', $userIdentifier)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            return ['is_liked' => false];
        } else {
            EngagementEvent::create([
                'reel_id' => $reelId,
                'event_type' => EngagementEvent::TYPE_LIKE,
                'user_identifier' => $userIdentifier,
                'created_at' => now(),
            ]);
            return ['is_liked' => true];
        }
    }

    /**
     * Get aggregated statistics for a seller's reels.
     *
     * @param int $umkmProfileId The UMKM profile ID
     * @return array Statistics per reel with aggregated counts
     */
    public function getStats(int $umkmProfileId): array
    {
        // Get all reels for the UMKM profile
        $reels = Reel::where('umkm_profile_id', $umkmProfileId)->get();

        $stats = [];

        foreach ($reels as $reel) {
            $eventCounts = EngagementEvent::where('reel_id', $reel->id)
                ->selectRaw('event_type, COUNT(*) as count')
                ->groupBy('event_type')
                ->pluck('count', 'event_type')
                ->toArray();

            $stats[] = [
                'reel_id' => $reel->id,
                'product_name' => $reel->product_name,
                'thumbnail_url' => $reel->thumbnail_url,
                'views' => $eventCounts[EngagementEvent::TYPE_VIEW] ?? 0,
                'likes' => $eventCounts[EngagementEvent::TYPE_LIKE] ?? 0,
                'shares' => $eventCounts[EngagementEvent::TYPE_SHARE] ?? 0,
                'click_wa' => $eventCounts[EngagementEvent::TYPE_CLICK_WA] ?? 0,
            ];
        }

        return $stats;
    }

    /**
     * Get total statistics for a seller.
     *
     * @param int $umkmProfileId The UMKM profile ID
     * @return array Total aggregated counts
     */
    public function getTotalStats(int $umkmProfileId): array
    {
        $reelIds = Reel::where('umkm_profile_id', $umkmProfileId)->pluck('id');

        $eventCounts = EngagementEvent::whereIn('reel_id', $reelIds)
            ->selectRaw('event_type, COUNT(*) as count')
            ->groupBy('event_type')
            ->pluck('count', 'event_type')
            ->toArray();

        return [
            'total_views' => $eventCounts[EngagementEvent::TYPE_VIEW] ?? 0,
            'total_likes' => $eventCounts[EngagementEvent::TYPE_LIKE] ?? 0,
            'total_shares' => $eventCounts[EngagementEvent::TYPE_SHARE] ?? 0,
            'total_click_wa' => $eventCounts[EngagementEvent::TYPE_CLICK_WA] ?? 0,
            'total_reels' => $reelIds->count(),
        ];
    }
}
