<?php

namespace App\Services;

use App\Models\Reel;
use App\Models\UmkmProfile;
use Illuminate\Support\Collection;

class LocationService
{
    /**
     * Earth's radius in kilometers.
     */
    private const EARTH_RADIUS_KM = 6371;

    /**
     * Calculate distance between two coordinates using Haversine formula.
     * 
     * @param float $lat1 Latitude of first point
     * @param float $lng1 Longitude of first point
     * @param float $lat2 Latitude of second point
     * @param float $lng2 Longitude of second point
     * @return float Distance in kilometers
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        // Convert degrees to radians
        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLng = deg2rad($lng2 - $lng1);

        // Haversine formula
        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1Rad) * cos($lat2Rad) *
             sin($deltaLng / 2) * sin($deltaLng / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS_KM * $c;
    }

    /**
     * Get reels within a specified radius from a location.
     * 
     * @param float $lat User's latitude
     * @param float $lng User's longitude
     * @param float $radius Radius in kilometers
     * @param int $perPage Items per page
     * @param int $page Current page
     * @return array{data: Collection, meta: array}
     */
    public function getReelsWithinRadius(
        float $lat,
        float $lng,
        float $radius,
        int $perPage = 15,
        int $page = 1
    ): array {
        // Get all published reels with their UMKM profiles that are not blocked
        $reels = Reel::with('umkmProfile')
            ->where('status', 'published')
            ->where('is_blocked', false)
            ->whereHas('umkmProfile', function ($query) {
                $query->where('is_blocked', false);
            })
            ->get();

        // Calculate distance for each reel and filter by radius
        $reelsWithDistance = $reels->map(function ($reel) use ($lat, $lng) {
            $profile = $reel->umkmProfile;
            $distance = $this->calculateDistance(
                $lat,
                $lng,
                (float) $profile->latitude,
                (float) $profile->longitude
            );
            $reel->distance = $distance;
            return $reel;
        })->filter(function ($reel) use ($radius) {
            return $reel->distance <= $radius;
        });

        // Sort by distance (ascending) then by created_at (descending)
        $sortedReels = $reelsWithDistance->sort(function ($a, $b) {
            // Primary sort: distance ascending
            if ($a->distance !== $b->distance) {
                return $a->distance <=> $b->distance;
            }
            // Secondary sort: created_at descending
            return $b->created_at <=> $a->created_at;
        })->values();

        // Manual pagination
        $total = $sortedReels->count();
        $offset = ($page - 1) * $perPage;
        $paginatedReels = $sortedReels->slice($offset, $perPage)->values();

        return [
            'data' => $paginatedReels,
            'meta' => [
                'current_page' => $page,
                'last_page' => (int) ceil($total / $perPage) ?: 1,
                'per_page' => $perPage,
                'total' => $total,
            ],
        ];
    }
}
