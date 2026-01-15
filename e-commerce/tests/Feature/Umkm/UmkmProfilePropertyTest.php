<?php

namespace Tests\Feature\Umkm;

use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for UMKM Profile API
 * 
 * Feature: umkm-platform-completion
 */
class UmkmProfilePropertyTest extends TestCase
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
     * Property 1: Profile CRUD Consistency
     * 
     * For any valid UMKM profile data, creating a profile then reading it 
     * should return equivalent data with all submitted fields preserved.
     * 
     * Validates: Requirements 1.1, 1.3, 1.4
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_profile_crud_consistency(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Generate random valid data
            $profileData = $this->generateValidProfileData();

            // Create a seller user (unique per iteration)
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);

            // Create profile via API
            $createResponse = $this->actingAs($seller)
                ->postJson('/api/seller/profile', $profileData);

            $createResponse->assertStatus(201);
            $createdData = $createResponse->json('data');

            // Read own profile via API - refresh the user to get fresh relationship
            $seller->refresh();
            $readResponse = $this->actingAs($seller)
                ->getJson('/api/seller/profile');

            $readResponse->assertStatus(200);
            $readData = $readResponse->json('data');

            // Property: Created data should match read data
            $this->assertEquals($createdData['nama_toko'], $readData['nama_toko']);
            $this->assertEquals($createdData['nomor_wa'], $readData['nomor_wa']);
            $this->assertEquals($createdData['alamat'], $readData['alamat']);
            $this->assertEquals($createdData['kategori'], $readData['kategori']);
            $this->assertEquals(
                round((float)$createdData['latitude'], 5),
                round((float)$readData['latitude'], 5)
            );
            $this->assertEquals(
                round((float)$createdData['longitude'], 5),
                round((float)$readData['longitude'], 5)
            );

            // Read public profile via API
            $publicResponse = $this->getJson('/api/umkm/' . $createdData['id']);

            $publicResponse->assertStatus(200);
            $publicData = $publicResponse->json('data');

            // Property: Public data should match created data (public fields only)
            $this->assertEquals($createdData['nama_toko'], $publicData['nama_toko']);
            $this->assertEquals($createdData['nomor_wa'], $publicData['nomor_wa']);
            $this->assertEquals($createdData['alamat'], $publicData['alamat']);
            $this->assertEquals($createdData['kategori'], $publicData['kategori']);
        }
    }


    /**
     * Generate invalid WhatsApp number for property testing.
     */
    private function generateInvalidWhatsAppNumber(): string
    {
        $invalidFormats = [
            '07' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT), // Wrong prefix
            '09' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT), // Wrong prefix
            '12345', // Too short
            '+62' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT), // Has + sign
            'abc12345678', // Contains letters
            '', // Empty
        ];
        return $invalidFormats[array_rand($invalidFormats)];
    }

    /**
     * Generate invalid coordinates for property testing.
     */
    private function generateInvalidCoordinates(): array
    {
        $invalidTypes = rand(0, 2);
        
        switch ($invalidTypes) {
            case 0: // Invalid latitude (out of range)
                return [
                    'latitude' => rand(0, 1) ? rand(91, 180) : rand(-180, -91),
                    'longitude' => rand(-18000000, 18000000) / 100000,
                ];
            case 1: // Invalid longitude (out of range)
                return [
                    'latitude' => rand(-9000000, 9000000) / 100000,
                    'longitude' => rand(0, 1) ? rand(181, 360) : rand(-360, -181),
                ];
            default: // Both invalid
                return [
                    'latitude' => rand(0, 1) ? rand(91, 180) : rand(-180, -91),
                    'longitude' => rand(0, 1) ? rand(181, 360) : rand(-360, -181),
                ];
        }
    }

    /**
     * Property 2: Profile Validation Rejects Invalid Data
     * 
     * For any WhatsApp number not matching Indonesian format (08xx or 628xx) 
     * or coordinates outside valid range (-90 to 90 lat, -180 to 180 lng), 
     * the system should reject the submission with validation error.
     * 
     * Validates: Requirements 1.5, 1.6
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_profile_validation_rejects_invalid_data(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            
            // Test invalid WhatsApp number
            $invalidWaData = $this->generateValidProfileData();
            $invalidWaData['nomor_wa'] = $this->generateInvalidWhatsAppNumber();
            
            $waResponse = $this->actingAs($seller)
                ->postJson('/api/seller/profile', $invalidWaData);
            
            // Property: Invalid WhatsApp should be rejected with 422
            $this->assertEquals(422, $waResponse->status(), 
                "Invalid WA number '{$invalidWaData['nomor_wa']}' should be rejected");
            $this->assertArrayHasKey('errors', $waResponse->json());
            $this->assertArrayHasKey('nomor_wa', $waResponse->json('errors'));
            
            // Create new seller for coordinate test
            $seller2 = User::factory()->create(['role' => User::ROLE_SELLER]);
            
            // Test invalid coordinates
            $invalidCoordData = $this->generateValidProfileData();
            $invalidCoords = $this->generateInvalidCoordinates();
            $invalidCoordData['latitude'] = $invalidCoords['latitude'];
            $invalidCoordData['longitude'] = $invalidCoords['longitude'];
            
            $coordResponse = $this->actingAs($seller2)
                ->postJson('/api/seller/profile', $invalidCoordData);
            
            // Property: Invalid coordinates should be rejected with 422
            $this->assertEquals(422, $coordResponse->status(),
                "Invalid coords lat:{$invalidCoordData['latitude']} lng:{$invalidCoordData['longitude']} should be rejected");
            $this->assertArrayHasKey('errors', $coordResponse->json());
            $hasLatError = array_key_exists('latitude', $coordResponse->json('errors'));
            $hasLngError = array_key_exists('longitude', $coordResponse->json('errors'));
            $this->assertTrue($hasLatError || $hasLngError, 
                "Should have latitude or longitude error");
        }
    }
}
