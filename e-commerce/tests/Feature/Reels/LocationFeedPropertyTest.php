<?php

namespace Tests\Feature\Reels;

use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use App\Services\LocationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for Location-Based Feed API
 * 
 * Feature: umkm-platform-completion
 */
class LocationFeedPropertyTest extends TestCase
{
    use RefreshDatabase;

    private LocationService $locationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->locationService = new LocationService();
    }

    /**
     * Generate random coordinates within Indonesia bounds.
     */
    private function generateIndonesiaCoordinates(): array
    {
        // Indonesia roughly spans: lat -11 to 6, lng 95 to 141
        return [
            'latitude' => rand(-1100000, 600000) / 100000,
            'longitude' => rand(9500000, 14100000) / 100000,
        ];
    }

    /**
     * Generate coordinates at a specific distance from a point.
     * Uses approximate calculation for test purposes.
     */
    private function generateCoordinatesAtDistance(float $baseLat, float $baseLng, float $distanceKm): array
    {
        // Approximate: 1 degree latitude = 111 km
        // 1 degree longitude = 111 * cos(latitude) km
        $latOffset = $distanceKm / 111;
        $lngOffset = $distanceKm / (111 * cos(deg2rad($baseLat)));
        
        // Random angle
        $angle = rand(0, 360) * M_PI / 180;
        
        return [
            'latitude' => $baseLat + ($latOffset * sin($angle)),
            'longitude' => $baseLng + ($lngOffset * cos($angle)),
        ];
    }

    /**
     * Create a seller with UMKM profile at specific coordinates.
     */
    private function createSellerWithProfile(float $lat, float $lng): array
    {
        $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
        $profile = UmkmProfile::factory()->create([
            'user_id' => $seller->id,
            'latitude' => $lat,
            'longitude' => $lng,
            'is_blocked' => false,
        ]);
        
        return ['seller' => $seller, 'profile' => $profile];
    }

    /**
     * Create a published reel for a profile.
     */
    private function createPublishedReel(UmkmProfile $profile): Reel
    {
        return Reel::factory()->create([
            'umkm_profile_id' => $profile->id,
            'status' => 'published',
            'product_name' => 'Produk ' . bin2hex(random_bytes(4)),
        ]);
    }

    /**
     * Property 5: Location-Based Feed Filtering
     * 
     * For any feed request with latitude, longitude, and radius, all returned 
     * reels should be from UMKM profiles within the specified radius distance.
     * 
     * Validates: Requirements 3.1
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_location_based_feed_filtering(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Generate random user location
            $userCoords = $this->generateIndonesiaCoordinates();
            $userLat = $userCoords['latitude'];
            $userLng = $userCoords['longitude'];
            
            // Random radius between 1 and 20 km
            $radius = rand(100, 2000) / 100;
            
            // Create some sellers within radius
            $withinCount = rand(1, 3);
            $withinReels = [];
            for ($j = 0; $j < $withinCount; $j++) {
                $distance = rand(10, (int)($radius * 90)) / 100; // 10% to 90% of radius
                $coords = $this->generateCoordinatesAtDistance($userLat, $userLng, $distance);
                $data = $this->createSellerWithProfile($coords['latitude'], $coords['longitude']);
                $reel = $this->createPublishedReel($data['profile']);
                $withinReels[] = $reel;
            }
            
            // Create some sellers outside radius
            $outsideCount = rand(1, 2);
            for ($j = 0; $j < $outsideCount; $j++) {
                $distance = $radius + rand(500, 2000) / 100; // 5 to 20 km beyond radius
                $coords = $this->generateCoordinatesAtDistance($userLat, $userLng, $distance);
                $data = $this->createSellerWithProfile($coords['latitude'], $coords['longitude']);
                $this->createPublishedReel($data['profile']);
            }
            
            // Request feed
            $response = $this->getJson("/api/reels?lat={$userLat}&lng={$userLng}&radius={$radius}");
            
            $response->assertStatus(200);
            $feedData = $response->json('data');
            
            // Property: All returned reels should be within radius
            foreach ($feedData as $reelData) {
                $distance = $reelData['distance_km'];
                $this->assertLessThanOrEqual(
                    $radius,
                    $distance,
                    "Reel at distance {$distance}km should be within radius {$radius}km"
                );
            }
            
            // Property: All reels within radius should be returned
            $returnedIds = array_column($feedData, 'id');
            foreach ($withinReels as $reel) {
                $this->assertContains(
                    $reel->id,
                    $returnedIds,
                    "Reel {$reel->id} within radius should be in feed"
                );
            }
            
            // Clean up for next iteration
            Reel::query()->delete();
            UmkmProfile::query()->delete();
            User::where('role', User::ROLE_SELLER)->delete();
        }
    }

    /**
     * Property 6: Feed Sorting Consistency
     * 
     * For any feed result, reels should be sorted by distance (ascending) as 
     * primary sort and creation time (descending) as secondary sort.
     * 
     * Validates: Requirements 3.2
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_feed_sorting_consistency(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Generate random user location
            $userCoords = $this->generateIndonesiaCoordinates();
            $userLat = $userCoords['latitude'];
            $userLng = $userCoords['longitude'];
            
            // Fixed radius for this test
            $radius = 15;
            
            // Create multiple sellers at various distances
            $reelCount = rand(3, 6);
            for ($j = 0; $j < $reelCount; $j++) {
                $distance = rand(10, 1400) / 100; // 0.1 to 14 km
                $coords = $this->generateCoordinatesAtDistance($userLat, $userLng, $distance);
                $data = $this->createSellerWithProfile($coords['latitude'], $coords['longitude']);
                
                // Create reel with slight delay to ensure different timestamps
                $this->createPublishedReel($data['profile']);
            }
            
            // Request feed
            $response = $this->getJson("/api/reels?lat={$userLat}&lng={$userLng}&radius={$radius}");
            
            $response->assertStatus(200);
            $feedData = $response->json('data');
            
            // Property: Feed should be sorted by distance ascending
            $previousDistance = -1;
            $previousCreatedAt = null;
            
            foreach ($feedData as $index => $reelData) {
                $currentDistance = $reelData['distance_km'];
                $currentCreatedAt = $reelData['created_at'];
                
                if ($index > 0) {
                    // Primary sort: distance should be ascending or equal
                    $this->assertGreaterThanOrEqual(
                        $previousDistance,
                        $currentDistance,
                        "Feed should be sorted by distance ascending. " .
                        "Item {$index} has distance {$currentDistance}km but previous was {$previousDistance}km"
                    );
                    
                    // Secondary sort: if same distance, created_at should be descending
                    if (abs($currentDistance - $previousDistance) < 0.01) {
                        $this->assertLessThanOrEqual(
                            $previousCreatedAt,
                            $currentCreatedAt,
                            "For same distance, feed should be sorted by created_at descending"
                        );
                    }
                }
                
                $previousDistance = $currentDistance;
                $previousCreatedAt = $currentCreatedAt;
            }
            
            // Clean up for next iteration
            Reel::query()->delete();
            UmkmProfile::query()->delete();
            User::where('role', User::ROLE_SELLER)->delete();
        }
    }
}
