<?php

namespace Tests\Feature\WhatsApp;

use App\Models\Reel;
use App\Models\UmkmProfile;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-Based Tests for WhatsApp Link Generation
 * 
 * Feature: umkm-platform-completion
 * Property 7: WhatsApp Link Generation
 * Validates: Requirements 4.1, 4.2
 */
class WhatsAppLinkPropertyTest extends TestCase
{
    use RefreshDatabase;

    private WhatsAppService $whatsAppService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->whatsAppService = new WhatsAppService();
    }

    /**
     * Generate random Indonesian phone number for property testing.
     * Returns either 08xx or 628xx format.
     */
    private function generateIndonesianPhoneNumber(): string
    {
        $formats = [
            '08' . rand(10, 99) . rand(1000000, 9999999), // 08xx format
            '628' . rand(10, 99) . rand(1000000, 9999999), // 628xx format
        ];
        
        return $formats[array_rand($formats)];
    }

    /**
     * Generate random product name for property testing.
     */
    private function generateProductName(): string
    {
        $products = [
            'Nasi Goreng Spesial',
            'Bakso Urat Premium',
            'Kaos Polos Katun',
            'Sepatu Sneakers',
            'Tas Kulit Asli',
            'Kopi Arabika',
            'Sambal Terasi',
            'Keripik Singkong',
        ];
        
        return $products[array_rand($products)] . ' ' . rand(1, 100);
    }

    /**
     * Generate random UMKM/store name for property testing.
     */
    private function generateUmkmName(): string
    {
        $prefixes = ['Toko', 'Warung', 'Kedai', 'Rumah', 'Depot'];
        $names = ['Berkah', 'Sejahtera', 'Makmur', 'Barokah', 'Jaya', 'Sentosa'];
        
        return $prefixes[array_rand($prefixes)] . ' ' . $names[array_rand($names)] . ' ' . rand(1, 100);
    }

    /**
     * Property 7: WhatsApp Link Generation
     * 
     * For any reel with associated UMKM profile, the generated WhatsApp link 
     * should contain the product name and UMKM name in the message template.
     * 
     * Validates: Requirements 4.1, 4.2
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_whatsapp_link_contains_product_and_umkm_name(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            $phone = $this->generateIndonesianPhoneNumber();
            $productName = $this->generateProductName();
            $umkmName = $this->generateUmkmName();

            // Generate WhatsApp link using the service
            $link = $this->whatsAppService->generateLink($phone, $productName, $umkmName);

            // Property 1: Link should start with WhatsApp base URL
            $this->assertStringStartsWith(
                'https://wa.me/',
                $link,
                "WhatsApp link should start with https://wa.me/"
            );

            // Property 2: Link should contain the product name (URL encoded)
            $this->assertStringContainsString(
                urlencode($productName),
                $link,
                "WhatsApp link should contain the product name: {$productName}"
            );

            // Property 3: Link should contain the UMKM name (URL encoded)
            $this->assertStringContainsString(
                urlencode($umkmName),
                $link,
                "WhatsApp link should contain the UMKM name: {$umkmName}"
            );

            // Property 4: Phone number should be in international format (62xx)
            $normalizedPhone = $this->whatsAppService->normalizePhoneNumber($phone);
            $this->assertStringStartsWith(
                '62',
                $normalizedPhone,
                "Phone number should be normalized to international format (62xx)"
            );
            $this->assertStringContainsString(
                $normalizedPhone,
                $link,
                "WhatsApp link should contain the normalized phone number"
            );
        }
    }

    /**
     * Property 7 (Extended): WhatsApp Link via Reel Model Accessor
     * 
     * For any reel with associated UMKM profile, the whatsapp_link accessor
     * should return a valid WhatsApp link with product and UMKM name.
     * 
     * Validates: Requirements 4.1, 4.2
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_reel_whatsapp_link_accessor(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            // Create a seller with UMKM profile
            $seller = User::factory()->create(['role' => User::ROLE_SELLER]);
            $profile = UmkmProfile::factory()->create([
                'user_id' => $seller->id,
                'nomor_wa' => $this->generateIndonesianPhoneNumber(),
                'nama_toko' => $this->generateUmkmName(),
            ]);

            // Create a reel
            $productName = $this->generateProductName();
            $reel = Reel::factory()->create([
                'umkm_profile_id' => $profile->id,
                'product_name' => $productName,
            ]);

            // Get WhatsApp link via accessor
            $link = $reel->whatsapp_link;

            // Property 1: Link should not be empty
            $this->assertNotEmpty($link, "WhatsApp link should not be empty");

            // Property 2: Link should start with WhatsApp base URL
            $this->assertStringStartsWith(
                'https://wa.me/',
                $link,
                "WhatsApp link should start with https://wa.me/"
            );

            // Property 3: Link should contain the product name (URL encoded)
            $this->assertStringContainsString(
                urlencode($productName),
                $link,
                "WhatsApp link should contain the product name: {$productName}"
            );

            // Property 4: Link should contain the UMKM name (URL encoded)
            $this->assertStringContainsString(
                urlencode($profile->nama_toko),
                $link,
                "WhatsApp link should contain the UMKM name: {$profile->nama_toko}"
            );
        }
    }

    /**
     * Property: Phone Number Normalization
     * 
     * For any Indonesian phone number (08xx or 628xx format), 
     * normalization should produce a valid international format (62xx).
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_phone_number_normalization(): void
    {
        // Run 100 iterations for property-based testing
        for ($i = 0; $i < 100; $i++) {
            $phone = $this->generateIndonesianPhoneNumber();
            $normalized = $this->whatsAppService->normalizePhoneNumber($phone);

            // Property 1: Normalized phone should start with 62
            $this->assertStringStartsWith(
                '62',
                $normalized,
                "Normalized phone should start with 62, got: {$normalized}"
            );

            // Property 2: Normalized phone should only contain digits
            $this->assertMatchesRegularExpression(
                '/^[0-9]+$/',
                $normalized,
                "Normalized phone should only contain digits"
            );

            // Property 3: Normalized phone should have reasonable length (10-15 digits)
            $length = strlen($normalized);
            $this->assertGreaterThanOrEqual(10, $length, "Phone number too short");
            $this->assertLessThanOrEqual(15, $length, "Phone number too long");
        }
    }
}
