<?php

namespace Tests\Feature\Engagement;

use App\Models\EngagementEvent;
use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for Engagement Tracking API
 * 
 * Feature: umkm-platform-completion
 */
class EngagementPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Generate random valid event type.
     */
    private function generateValidEventType(): string
    {
        return EngagementEvent::VALID_TYPES[array_rand(EngagementEvent::VALID_TYPES)];
    }

    /**
     * Generate random user identifier.
     */
    private function generateUserIdentifier(): string
    {
        $types = ['ip', 'user'];
        $type = $types[array_rand($types)];
        
        if ($type === 'ip') {
            return 'ip:' . rand(1, 255) . '.' . rand(0, 255) . '.' . rand(0, 255) . '.' . rand(0, 255);
        }
        
        return 'user:' . rand(1, 10000);
    }

    /**
     * Property 8: Engagement Event Recording
     * 
     * For any engagement action (view, like, share, click_wa), the system should 
     * record an event that can be retrieved in statistics.
     * 
     * Validates: Requirements 5.1, 5.2, 5.3, 5.4
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_engagement_event_recording(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile and reel
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);
            $reel = Reel::factory()->create(['umkm_profile_id' => $profile->id]);

            // Generate random event type
            $eventType = $this->generateValidEventType();
            $userIdentifier = $this->generateUserIdentifier();

            // Record the event via API
            $response = $this->postJson("/api/reels/{$reel->id}/events", [
                'event_type' => $eventType,
            ], [
                'REMOTE_ADDR' => str_replace('ip:', '', $userIdentifier),
            ]);

            // Property: Event should be recorded successfully
            $this->assertContains($response->status(), [200, 201],
                "Event recording should succeed for event type: {$eventType}");

            // Property: Event should exist in database
            $this->assertDatabaseHas('engagement_events', [
                'reel_id' => $reel->id,
                'event_type' => $eventType,
            ]);

            // Property: Statistics should reflect the recorded event
            $statsResponse = $this->actingAs($seller)
                ->getJson('/api/seller/stats');

            $statsResponse->assertStatus(200);
            $stats = $statsResponse->json('data.reels');

            // Find the reel in stats
            $reelStats = collect($stats)->firstWhere('reel_id', $reel->id);
            $this->assertNotNull($reelStats, 'Reel should appear in statistics');

            // Property: The event count should be at least 1
            $countKey = match($eventType) {
                EngagementEvent::TYPE_VIEW => 'views',
                EngagementEvent::TYPE_LIKE => 'likes',
                EngagementEvent::TYPE_SHARE => 'shares',
                EngagementEvent::TYPE_CLICK_WA => 'click_wa',
            };
            
            $this->assertGreaterThanOrEqual(1, $reelStats[$countKey],
                "Statistics should show at least 1 {$eventType} event");
        }
    }

    /**
     * Property 9: Engagement Throttling
     * 
     * For any duplicate engagement event from the same user identifier within 1 minute, 
     * the system should not create a new event record.
     * 
     * Validates: Requirements 5.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_engagement_throttling(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile and reel
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);
            $reel = Reel::factory()->create(['umkm_profile_id' => $profile->id]);

            // Generate random event type and user identifier
            $eventType = $this->generateValidEventType();
            $userIp = rand(1, 255) . '.' . rand(0, 255) . '.' . rand(0, 255) . '.' . rand(0, 255);

            // First request - should be recorded
            $firstResponse = $this->postJson("/api/reels/{$reel->id}/events", [
                'event_type' => $eventType,
            ], [
                'REMOTE_ADDR' => $userIp,
            ]);

            $this->assertEquals(201, $firstResponse->status(),
                "First event should be recorded successfully");

            // Count events after first request
            $countAfterFirst = EngagementEvent::where('reel_id', $reel->id)
                ->where('event_type', $eventType)
                ->count();

            // Second request (duplicate) - should be throttled
            $secondResponse = $this->postJson("/api/reels/{$reel->id}/events", [
                'event_type' => $eventType,
            ], [
                'REMOTE_ADDR' => $userIp,
            ]);

            // Property: Second request should return 200 with throttled flag
            $this->assertEquals(200, $secondResponse->status(),
                "Duplicate event should be throttled");
            $this->assertTrue($secondResponse->json('throttled'),
                "Response should indicate throttling");

            // Property: Event count should not increase
            $countAfterSecond = EngagementEvent::where('reel_id', $reel->id)
                ->where('event_type', $eventType)
                ->count();

            $this->assertEquals($countAfterFirst, $countAfterSecond,
                "Throttled event should not create new record");

            // Property: Different event type from same user should NOT be throttled
            $differentEventType = collect(EngagementEvent::VALID_TYPES)
                ->filter(fn($type) => $type !== $eventType)
                ->random();

            $differentTypeResponse = $this->postJson("/api/reels/{$reel->id}/events", [
                'event_type' => $differentEventType,
            ], [
                'REMOTE_ADDR' => $userIp,
            ]);

            $this->assertEquals(201, $differentTypeResponse->status(),
                "Different event type should not be throttled");
        }
    }

    /**
     * Property 10: Statistics Aggregation Accuracy
     * 
     * For any seller, the statistics should accurately reflect the count of each 
     * engagement event type across all their reels.
     * 
     * Validates: Requirements 5.6
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_statistics_aggregation_accuracy(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);

            // Create random number of reels (1-5)
            $reelCount = rand(1, 5);
            $reels = [];
            for ($r = 0; $r < $reelCount; $r++) {
                $reels[] = Reel::factory()->create(['umkm_profile_id' => $profile->id]);
            }

            // Track expected counts per reel
            $expectedCounts = [];
            foreach ($reels as $reel) {
                $expectedCounts[$reel->id] = [
                    'views' => 0,
                    'likes' => 0,
                    'shares' => 0,
                    'click_wa' => 0,
                ];
            }

            // Create random engagement events for each reel
            foreach ($reels as $reel) {
                // Random number of events per type (0-3)
                foreach (EngagementEvent::VALID_TYPES as $eventType) {
                    $eventCount = rand(0, 3);
                    for ($e = 0; $e < $eventCount; $e++) {
                        // Use unique user identifier to avoid throttling
                        $userIdentifier = 'user:' . uniqid() . '_' . $e;
                        EngagementEvent::create([
                            'reel_id' => $reel->id,
                            'event_type' => $eventType,
                            'user_identifier' => $userIdentifier,
                            'created_at' => now(),
                        ]);

                        // Track expected count
                        $countKey = match($eventType) {
                            EngagementEvent::TYPE_VIEW => 'views',
                            EngagementEvent::TYPE_LIKE => 'likes',
                            EngagementEvent::TYPE_SHARE => 'shares',
                            EngagementEvent::TYPE_CLICK_WA => 'click_wa',
                        };
                        $expectedCounts[$reel->id][$countKey]++;
                    }
                }
            }

            // Get statistics via API
            $statsResponse = $this->actingAs($seller)
                ->getJson('/api/seller/stats');

            $statsResponse->assertStatus(200);
            $stats = $statsResponse->json('data.reels');
            $summary = $statsResponse->json('data.summary');

            // Property: Each reel's statistics should match expected counts
            foreach ($reels as $reel) {
                $reelStats = collect($stats)->firstWhere('reel_id', $reel->id);
                $this->assertNotNull($reelStats, "Reel {$reel->id} should appear in statistics");

                $expected = $expectedCounts[$reel->id];
                $this->assertEquals($expected['views'], $reelStats['views'],
                    "Views count should match for reel {$reel->id}");
                $this->assertEquals($expected['likes'], $reelStats['likes'],
                    "Likes count should match for reel {$reel->id}");
                $this->assertEquals($expected['shares'], $reelStats['shares'],
                    "Shares count should match for reel {$reel->id}");
                $this->assertEquals($expected['click_wa'], $reelStats['click_wa'],
                    "Click WA count should match for reel {$reel->id}");
            }

            // Property: Summary totals should match sum of all reel counts
            $totalViews = array_sum(array_column($expectedCounts, 'views'));
            $totalLikes = array_sum(array_column($expectedCounts, 'likes'));
            $totalShares = array_sum(array_column($expectedCounts, 'shares'));
            $totalClickWa = array_sum(array_column($expectedCounts, 'click_wa'));

            $this->assertEquals($totalViews, $summary['total_views'],
                "Total views should match sum of all reel views");
            $this->assertEquals($totalLikes, $summary['total_likes'],
                "Total likes should match sum of all reel likes");
            $this->assertEquals($totalShares, $summary['total_shares'],
                "Total shares should match sum of all reel shares");
            $this->assertEquals($totalClickWa, $summary['total_click_wa'],
                "Total click_wa should match sum of all reel click_wa");
            $this->assertEquals($reelCount, $summary['total_reels'],
                "Total reels count should match");
        }
    }
}
