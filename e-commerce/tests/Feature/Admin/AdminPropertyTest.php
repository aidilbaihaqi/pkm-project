<?php

namespace Tests\Feature\Admin;

use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Property-Based Tests for Admin Panel API
 * 
 * Feature: umkm-platform-completion
 */
class AdminPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Generate random valid profile data for property testing.
     */
    private function generateValidProfileData(): array
    {
        $waFormats = ['08', '628'];
        $waPrefix = $waFormats[array_rand($waFormats)];
        $waNumber = $waPrefix . str_pad(rand(10000000, 9999999999), 10, '0', STR_PAD_LEFT);

        return [
            'nama_toko' => 'Toko ' . bin2hex(random_bytes(8)),
            'nomor_wa' => substr($waNumber, 0, 15),
            'alamat' => 'Jl. Test No. ' . rand(1, 999),
            'latitude' => rand(-9000000, 9000000) / 100000,
            'longitude' => rand(-18000000, 18000000) / 100000,
            'kategori' => ['makanan', 'minuman', 'fashion'][rand(0, 2)],
            'deskripsi' => 'Deskripsi test ' . rand(1, 1000),
        ];
    }

    /**
     * Create a seller with UMKM profile for testing.
     */
    private function createSellerWithProfile(): User
    {
        $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
        $profileData = $this->generateValidProfileData();
        $profileData['user_id'] = $seller->id;
        UmkmProfile::create($profileData);
        return $seller->fresh(['umkmProfile']);
    }

    /**
     * Property 11: Seller Blocking Round-Trip
     * 
     * For any seller, blocking then unblocking should restore their 
     * content visibility to the original state.
     * 
     * Validates: Requirements 6.2, 6.3
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_seller_blocking_round_trip(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create admin user
            $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
            
            // Create seller with profile
            $seller = $this->createSellerWithProfile();
            
            // Store original blocked state
            $originalBlockedState = $seller->umkmProfile->is_blocked;
            
            // Block the seller
            $blockResponse = $this->actingAs($admin)
                ->postJson("/api/admin/sellers/{$seller->id}/block");
            
            $blockResponse->assertStatus(200);
            
            // Verify seller is blocked
            $seller->refresh();
            $this->assertTrue($seller->umkmProfile->is_blocked, 
                "Seller should be blocked after block action");
            
            // Unblock the seller
            $unblockResponse = $this->actingAs($admin)
                ->postJson("/api/admin/sellers/{$seller->id}/unblock");
            
            $unblockResponse->assertStatus(200);
            
            // Verify seller is unblocked (restored to original state)
            $seller->refresh();
            $this->assertFalse($seller->umkmProfile->is_blocked, 
                "Seller should be unblocked after unblock action");
            
            // Property: After block then unblock, state should be restored
            $this->assertEquals($originalBlockedState, $seller->umkmProfile->is_blocked,
                "Blocking then unblocking should restore original state");
        }
    }


    /**
     * Property 12: Admin Authorization
     * 
     * For any request to admin endpoints from a non-admin user, 
     * the system should return 403 Forbidden.
     * 
     * Validates: Requirements 6.5
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_admin_authorization(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller (non-admin) user
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            
            // Create another seller with profile for testing block/unblock
            $targetSeller = $this->createSellerWithProfile();
            
            // Test all admin endpoints with non-admin user
            $adminEndpoints = [
                ['method' => 'get', 'url' => '/api/admin/sellers'],
                ['method' => 'post', 'url' => "/api/admin/sellers/{$targetSeller->id}/block"],
                ['method' => 'post', 'url' => "/api/admin/sellers/{$targetSeller->id}/unblock"],
                ['method' => 'get', 'url' => '/api/admin/stats'],
            ];
            
            foreach ($adminEndpoints as $endpoint) {
                $response = $this->actingAs($seller)
                    ->{$endpoint['method'] . 'Json'}($endpoint['url']);
                
                // Property: Non-admin should receive 403 Forbidden
                $this->assertEquals(403, $response->status(),
                    "Non-admin user should receive 403 for {$endpoint['method']} {$endpoint['url']}");
            }
            
            // Also test with unauthenticated user
            foreach ($adminEndpoints as $endpoint) {
                $response = $this->{$endpoint['method'] . 'Json'}($endpoint['url']);
                
                // Property: Unauthenticated should receive 401 (Unauthenticated)
                // Note: Laravel Sanctum returns 401 for unauthenticated requests
                $this->assertContains($response->status(), [401, 403],
                    "Unauthenticated user should receive 401 or 403 for {$endpoint['method']} {$endpoint['url']}");
            }
            
            // Verify admin CAN access these endpoints
            $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
            
            foreach ($adminEndpoints as $endpoint) {
                $response = $this->actingAs($admin)
                    ->{$endpoint['method'] . 'Json'}($endpoint['url']);
                
                // Property: Admin should NOT receive 403 or 401
                $this->assertNotEquals(403, $response->status(),
                    "Admin user should not receive 403 for {$endpoint['method']} {$endpoint['url']}");
                $this->assertNotEquals(401, $response->status(),
                    "Admin user should not receive 401 for {$endpoint['method']} {$endpoint['url']}");
            }
        }
    }
}
