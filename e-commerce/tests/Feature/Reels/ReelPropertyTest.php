<?php

namespace Tests\Feature\Reels;

use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for Reels Content API
 * 
 * Feature: umkm-platform-completion
 */
class ReelPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Generate random valid YouTube URL for property testing.
     */
    private function generateValidYouTubeUrl(): string
    {
        $videoId = bin2hex(random_bytes(5)) . substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 1);
        
        $formats = [
            "https://www.youtube.com/watch?v={$videoId}",
            "https://youtube.com/watch?v={$videoId}",
            "https://youtu.be/{$videoId}",
            "https://www.youtube.com/shorts/{$videoId}",
        ];
        
        return $formats[array_rand($formats)];
    }

    /**
     * Generate random valid reel data for property testing.
     */
    private function generateValidReelData(): array
    {
        return [
            'video_url' => $this->generateValidYouTubeUrl(),
            'thumbnail_url' => 'https://img.youtube.com/vi/' . bin2hex(random_bytes(5)) . '/maxresdefault.jpg',
            'product_name' => 'Produk ' . bin2hex(random_bytes(8)),
            'caption' => 'Caption test ' . rand(1, 1000),
            'price' => rand(10000, 1000000) / 100,
            'kategori' => ['makanan', 'minuman', 'fashion', 'elektronik'][rand(0, 3)],
            'type' => ['video', 'image'][rand(0, 1)],
            'status' => ['draft', 'review', 'published'][rand(0, 2)],
        ];
    }

    /**
     * Generate invalid YouTube URL for property testing.
     */
    private function generateInvalidYouTubeUrl(): string
    {
        $invalidUrls = [
            'https://vimeo.com/' . rand(100000, 999999),
            'https://www.dailymotion.com/video/' . bin2hex(random_bytes(4)),
            'https://www.tiktok.com/@user/video/' . rand(1000000000, 9999999999),
            'https://facebook.com/watch?v=' . rand(100000, 999999),
            'https://instagram.com/reel/' . bin2hex(random_bytes(6)),
            'not-a-url-at-all',
            'http://example.com/video.mp4',
            'https://youtube.com/invalid/' . bin2hex(random_bytes(5)),
            'ftp://youtube.com/watch?v=' . bin2hex(random_bytes(5)),
        ];
        
        return $invalidUrls[array_rand($invalidUrls)];
    }

    /**
     * Property 3: Reel CRUD Consistency
     * 
     * For any valid reel data, creating, updating, or deleting a reel should 
     * result in consistent state where reads reflect the latest operation.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3, 2.4
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_reel_crud_consistency(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);

            // Generate random valid reel data
            $reelData = $this->generateValidReelData();

            // CREATE: Create reel via API
            $createResponse = $this->actingAs($seller)
                ->postJson('/api/seller/reels', $reelData);

            $createResponse->assertStatus(201);
            $createdData = $createResponse->json('data');

            // Property: Created data should match submitted data
            $this->assertEquals($reelData['product_name'], $createdData['product_name']);
            $this->assertEquals($reelData['kategori'], $createdData['kategori']);
            $this->assertEquals($reelData['video_url'], $createdData['video_url']);

            // READ: List own reels via API
            $listResponse = $this->actingAs($seller)
                ->getJson('/api/seller/reels');

            $listResponse->assertStatus(200);
            $listData = $listResponse->json('data');

            // Property: Created reel should appear in list
            $this->assertCount(1, $listData);
            $this->assertEquals($createdData['id'], $listData[0]['id']);

            // UPDATE: Update reel via API
            $updateData = $this->generateValidReelData();
            $updateResponse = $this->actingAs($seller)
                ->putJson('/api/seller/reels/' . $createdData['id'], $updateData);

            $updateResponse->assertStatus(200);
            $updatedData = $updateResponse->json('data');

            // Property: Updated data should match new submitted data
            $this->assertEquals($updateData['product_name'], $updatedData['product_name']);
            $this->assertEquals($updateData['kategori'], $updatedData['kategori']);

            // READ after UPDATE: Verify list reflects update
            $listAfterUpdate = $this->actingAs($seller)
                ->getJson('/api/seller/reels');

            $listAfterUpdate->assertStatus(200);
            $this->assertEquals($updateData['product_name'], $listAfterUpdate->json('data.0.product_name'));

            // DELETE: Delete reel via API
            $deleteResponse = $this->actingAs($seller)
                ->deleteJson('/api/seller/reels/' . $createdData['id']);

            $deleteResponse->assertStatus(200);

            // READ after DELETE: Verify reel is removed from list
            $listAfterDelete = $this->actingAs($seller)
                ->getJson('/api/seller/reels');

            $listAfterDelete->assertStatus(200);
            $this->assertCount(0, $listAfterDelete->json('data'));
        }
    }

    /**
     * Property 4: YouTube URL Validation
     * 
     * For any URL that is not a valid YouTube URL format (youtube.com/watch, 
     * youtu.be, youtube.com/shorts), the system should reject the reel creation.
     * 
     * Validates: Requirements 2.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_youtube_url_validation(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create(['user_id' => $seller->id]);

            // Generate reel data with invalid YouTube URL
            $reelData = $this->generateValidReelData();
            $invalidUrl = $this->generateInvalidYouTubeUrl();
            $reelData['video_url'] = $invalidUrl;

            // Attempt to create reel with invalid URL
            $response = $this->actingAs($seller)
                ->postJson('/api/seller/reels', $reelData);

            // Property: Invalid YouTube URL should be rejected with 422
            $this->assertEquals(422, $response->status(),
                "Invalid YouTube URL '{$invalidUrl}' should be rejected");
            $this->assertArrayHasKey('errors', $response->json());
            $this->assertArrayHasKey('video_url', $response->json('errors'));
        }
    }
}
