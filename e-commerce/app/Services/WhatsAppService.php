<?php

namespace App\Services;

/**
 * Service for generating WhatsApp links with pre-filled message templates.
 */
class WhatsAppService
{
    /**
     * WhatsApp API base URL.
     */
    private const WHATSAPP_BASE_URL = 'https://wa.me/';

    /**
     * Generate a WhatsApp link with pre-filled message template.
     *
     * @param string $phone Phone number (Indonesian format: 08xx or 628xx)
     * @param string $productName Name of the product
     * @param string $umkmName Name of the UMKM/store
     * @return string WhatsApp link with pre-filled message
     */
    public function generateLink(string $phone, string $productName, string $umkmName): string
    {
        $normalizedPhone = $this->normalizePhoneNumber($phone);
        $message = $this->generateMessageTemplate($productName, $umkmName);
        
        return self::WHATSAPP_BASE_URL . $normalizedPhone . '?text=' . urlencode($message);
    }

    /**
     * Normalize Indonesian phone number to international format.
     * Converts 08xx to 628xx format for WhatsApp.
     *
     * @param string $phone Phone number
     * @return string Normalized phone number
     */
    public function normalizePhoneNumber(string $phone): string
    {
        // Remove any spaces, dashes, or other formatting
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Convert 08xx to 628xx format
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }
        
        return $phone;
    }

    /**
     * Generate message template with product and UMKM name.
     *
     * @param string $productName Name of the product
     * @param string $umkmName Name of the UMKM/store
     * @return string Message template
     */
    public function generateMessageTemplate(string $productName, string $umkmName): string
    {
        return "Halo {$umkmName}, saya tertarik dengan produk {$productName}";
    }
}
