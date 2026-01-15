<?php

namespace Tests\Feature\Serialization;

use App\Models\EngagementEvent;
use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for JSON Serialization Round-Trip
 * 
 * Feature: umkm-platform-completion
 * Property 13: JSON Serialization Round-Trip
 * 
 * For any valid data model (UmkmProfile, Reel, EngagementEvent), serializing to JSON 
 * then deserializing should produce an equivalent object.
 * 
 * Validates: Requirements 8.4, 8.5
 */
class JsonSerializationPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Generate random valid UMKM profile data for property testing.
     */
    private function generateRandomUmkmProfileData(): array
    {
        $waFormats = ['08', '628'];
        $waPrefix = $waFormats[array_rand($waFormats)];
        $waNumber = $waPrefix . str_pad(rand(10000000, 9999999999), 10, '0', STR_PAD_LEFT);

        return [
            'nama_toko' => 'Toko ' . bin2hex(random_bytes(8)),
            'nomor_wa' => substr($waNumber, 0, 15),
            'alamat' => 'Jl. Test No. ' . rand(1, 999) . ', ' . bin2hex(random_bytes(4)),
            'latitude' => rand(-9000000, 9000000) / 100000,
            'longitude' => rand(-18000000, 18000000) / 100000,
            'kategori' => ['makanan', 'minuman', 'fashion', 'elektronik', 'jasa'][rand(0, 4)],
            'deskripsi' => 'Deskripsi test ' . bin2hex(random_bytes(16)),
            'avatar' => rand(0, 1) ? 'https://example.com/avatar/' . bin2hex(random_bytes(8)) . '.jpg' : null,
            'is_open' => (bool) rand(0, 1),
            'open_hours' => sprintf('%02d:00-%02d:00', rand(6, 10), rand(18, 23)),
            'is_blocked' => (bool) rand(0, 1),
        ];
    }

    /**
     * Generate random valid reel data for property testing.
     */
    private function generateRandomReelData(): array
    {
        $videoId = bin2hex(random_bytes(5)) . substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 1);
        
        return [
            'video_url' => "https://www.youtube.com/watch?v={$videoId}",
            'thumbnail_url' => "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg",
            'product_name' => 'Produk ' . bin2hex(random_bytes(8)),
            'caption' => 'Caption test ' . bin2hex(random_bytes(16)),
            'price' => rand(10000, 10000000) / 100,
            'kategori' => ['makanan', 'minuman', 'fashion', 'elektronik', 'jasa'][rand(0, 4)],
            'type' => ['video', 'image'][rand(0, 1)],
            'status' => ['draft', 'review', 'published'][rand(0, 2)],
        ];
    }

    /**
     * Generate random valid engagement event data for property testing.
     */
    private function generateRandomEngagementEventData(): array
    {
        return [
            'user_identifier' => 'user:' . bin2hex(random_bytes(8)),
            'event_type' => EngagementEvent::VALID_TYPES[array_rand(EngagementEvent::VALID_TYPES)],
            'created_at' => now()->subMinutes(rand(0, 10000)),
        ];
    }

    /**
     * Compare two values with tolerance for decimal precision differences.
     */
    private function assertEquivalentValue($expected, $actual, string $field): void
    {
        // Handle null values
        if ($expected === null && $actual === null) {
            return;
        }

        // Handle numeric values with decimal precision
        if (is_numeric($expected) && is_numeric($actual)) {
            $this->assertEqualsWithDelta(
                (float) $expected,
                (float) $actual,
                0.0001,
                "Field '{$field}' should be equivalent after round-trip"
            );
            return;
        }

        // Handle boolean values
        if (is_bool($expected) || is_bool($actual)) {
            $this->assertEquals(
                (bool) $expected,
                (bool) $actual,
                "Field '{$field}' should be equivalent after round-trip"
            );
            return;
        }

        // Handle datetime values - compare as Carbon instances for proper timezone handling
        if ($expected instanceof \DateTimeInterface || $actual instanceof \DateTimeInterface || 
            (is_string($expected) && strtotime($expected) !== false) ||
            (is_string($actual) && strtotime($actual) !== false)) {
            
            // Convert to timestamps for comparison
            $expectedTimestamp = $expected instanceof \DateTimeInterface 
                ? $expected->getTimestamp() 
                : (is_string($expected) ? strtotime($expected) : $expected);
            $actualTimestamp = $actual instanceof \DateTimeInterface 
                ? $actual->getTimestamp() 
                : (is_string($actual) ? strtotime($actual) : $actual);
            
            // Allow 1 second tolerance for datetime comparisons
            $this->assertEqualsWithDelta(
                $expectedTimestamp,
                $actualTimestamp,
                1,
                "Field '{$field}' datetime should be equivalent after round-trip"
            );
            return;
        }

        // Default string/other comparison
        $this->assertEquals(
            $expected,
            $actual,
            "Field '{$field}' should be equivalent after round-trip"
        );
    }

    /**
     * Property 13: JSON Serialization Round-Trip for UmkmProfile
     * 
     * For any valid UmkmProfile, serializing to JSON then deserializing 
     * should produce an equivalent object.
     * 
     * Validates: Requirements 8.4, 8.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_umkm_profile_json_serialization_round_trip(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a user for the profile
            $user = User::factory()->create(['role' => User::ROLE_SELLER]);
            
            // Generate random profile data
            $profileData = $this->generateRandomUmkmProfileData();
            $profileData['user_id'] = $user->id;

            // Create the profile in database
            $originalProfile = UmkmProfile::create($profileData);
            $originalProfile->refresh();

            // Serialize to JSON
            $json = $originalProfile->toJson();
            
            // Property: JSON should be valid
            $this->assertJson($json, "UmkmProfile should serialize to valid JSON");

            // Deserialize from JSON
            $decoded = json_decode($json, true);
            
            // Property: Decoded data should not be null
            $this->assertNotNull($decoded, "Decoded JSON should not be null");

            // Create new model from decoded data (simulating deserialization)
            $reconstructedProfile = new UmkmProfile();
            $reconstructedProfile->forceFill($decoded);

            // Property: Key fields should be equivalent after round-trip
            $fieldsToCompare = [
                'nama_toko', 'nomor_wa', 'alamat', 'latitude', 'longitude',
                'kategori', 'deskripsi', 'avatar', 'is_open', 'open_hours', 'is_blocked'
            ];

            foreach ($fieldsToCompare as $field) {
                $this->assertEquivalentValue(
                    $originalProfile->$field,
                    $reconstructedProfile->$field,
                    $field
                );
            }

            // Property: ID should be preserved
            $this->assertEquals(
                $originalProfile->id,
                $reconstructedProfile->id,
                "ID should be preserved after round-trip"
            );
        }
    }

    /**
     * Property 13: JSON Serialization Round-Trip for Reel
     * 
     * For any valid Reel, serializing to JSON then deserializing 
     * should produce an equivalent object.
     * 
     * Validates: Requirements 8.4, 8.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_reel_json_serialization_round_trip(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);

            // Generate random reel data
            $reelData = $this->generateRandomReelData();
            $reelData['umkm_profile_id'] = $profile->id;

            // Create the reel in database
            $originalReel = Reel::create($reelData);
            $originalReel->refresh();

            // Serialize to JSON (without the computed whatsapp_link to avoid accessor issues)
            $originalReel->makeHidden(['whatsapp_link']);
            $json = $originalReel->toJson();
            
            // Property: JSON should be valid
            $this->assertJson($json, "Reel should serialize to valid JSON");

            // Deserialize from JSON
            $decoded = json_decode($json, true);
            
            // Property: Decoded data should not be null
            $this->assertNotNull($decoded, "Decoded JSON should not be null");

            // Create new model from decoded data (simulating deserialization)
            $reconstructedReel = new Reel();
            $reconstructedReel->forceFill($decoded);

            // Property: Key fields should be equivalent after round-trip
            $fieldsToCompare = [
                'video_url', 'thumbnail_url', 'product_name', 'caption',
                'price', 'kategori', 'type', 'status', 'umkm_profile_id'
            ];

            foreach ($fieldsToCompare as $field) {
                $this->assertEquivalentValue(
                    $originalReel->$field,
                    $reconstructedReel->$field,
                    $field
                );
            }

            // Property: ID should be preserved
            $this->assertEquals(
                $originalReel->id,
                $reconstructedReel->id,
                "ID should be preserved after round-trip"
            );
        }
    }

    /**
     * Property 13: JSON Serialization Round-Trip for EngagementEvent
     * 
     * For any valid EngagementEvent, serializing to JSON then deserializing 
     * should produce an equivalent object.
     * 
     * Validates: Requirements 8.4, 8.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_engagement_event_json_serialization_round_trip(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile and reel
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);
            $reel = Reel::factory()->create(['umkm_profile_id' => $profile->id]);

            // Generate random engagement event data with current time
            $eventData = [
                'reel_id' => $reel->id,
                'user_identifier' => 'user:' . bin2hex(random_bytes(8)),
                'event_type' => EngagementEvent::VALID_TYPES[array_rand(EngagementEvent::VALID_TYPES)],
                'created_at' => now(),
            ];

            // Create the engagement event in database
            $originalEvent = EngagementEvent::create($eventData);
            $originalEvent->refresh();

            // Serialize to JSON
            $json = $originalEvent->toJson();
            
            // Property: JSON should be valid
            $this->assertJson($json, "EngagementEvent should serialize to valid JSON");

            // Deserialize from JSON
            $decoded = json_decode($json, true);
            
            // Property: Decoded data should not be null
            $this->assertNotNull($decoded, "Decoded JSON should not be null");

            // Create new model from decoded data (simulating deserialization)
            $reconstructedEvent = new EngagementEvent();
            $reconstructedEvent->forceFill($decoded);

            // Property: Key fields should be equivalent after round-trip
            $fieldsToCompare = ['reel_id', 'user_identifier', 'event_type'];

            foreach ($fieldsToCompare as $field) {
                $this->assertEquivalentValue(
                    $originalEvent->$field,
                    $reconstructedEvent->$field,
                    $field
                );
            }

            // Property: ID should be preserved
            $this->assertEquals(
                $originalEvent->id,
                $reconstructedEvent->id,
                "ID should be preserved after round-trip"
            );

            // Property: created_at should be present in JSON
            $this->assertArrayHasKey('created_at', $decoded, "created_at should be in JSON");
            $this->assertNotNull($decoded['created_at'], "created_at should not be null");
        }
    }

    /**
     * Property 13: JSON Serialization Round-Trip via API Response
     * 
     * For any valid data returned from API endpoints, the JSON response 
     * should be deserializable and contain all expected fields.
     * 
     * Validates: Requirements 8.4, 8.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_api_response_json_serialization_round_trip(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profileData = $this->generateRandomUmkmProfileData();

            // Create profile via API
            $createProfileResponse = $this->actingAs($seller)
                ->postJson('/api/seller/profile', $profileData);

            $createProfileResponse->assertStatus(201);
            
            // Property: API response should be valid JSON
            $profileJson = $createProfileResponse->getContent();
            $this->assertJson($profileJson, "API profile response should be valid JSON");

            // Deserialize and verify structure
            $profileDecoded = json_decode($profileJson, true);
            $this->assertArrayHasKey('data', $profileDecoded, "Response should have 'data' key");
            $this->assertArrayHasKey('nama_toko', $profileDecoded['data'], "Profile data should have 'nama_toko'");
            $this->assertArrayHasKey('nomor_wa', $profileDecoded['data'], "Profile data should have 'nomor_wa'");

            // Property: Decoded data should match submitted data
            $this->assertEquals($profileData['nama_toko'], $profileDecoded['data']['nama_toko']);
            $this->assertEquals($profileData['nomor_wa'], $profileDecoded['data']['nomor_wa']);
            $this->assertEquals($profileData['kategori'], $profileDecoded['data']['kategori']);

            // Refresh seller to get the profile relationship
            $seller->refresh();

            // Create reel via API
            $reelData = $this->generateRandomReelData();
            $createReelResponse = $this->actingAs($seller)
                ->postJson('/api/seller/reels', $reelData);

            $createReelResponse->assertStatus(201);

            // Property: API response should be valid JSON
            $reelJson = $createReelResponse->getContent();
            $this->assertJson($reelJson, "API reel response should be valid JSON");

            // Deserialize and verify structure
            $reelDecoded = json_decode($reelJson, true);
            $this->assertArrayHasKey('data', $reelDecoded, "Response should have 'data' key");
            $this->assertArrayHasKey('product_name', $reelDecoded['data'], "Reel data should have 'product_name'");
            $this->assertArrayHasKey('video_url', $reelDecoded['data'], "Reel data should have 'video_url'");

            // Property: Decoded data should match submitted data
            $this->assertEquals($reelData['product_name'], $reelDecoded['data']['product_name']);
            $this->assertEquals($reelData['video_url'], $reelDecoded['data']['video_url']);
            $this->assertEquals($reelData['kategori'], $reelDecoded['data']['kategori']);
        }
    }
}
