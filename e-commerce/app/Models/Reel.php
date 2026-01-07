<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'umkm_profile_id',
        'video_url',
        'thumbnail_url',
        'product_name',
        'caption',
        'price',
        'kategori',
        'type',
        'status',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['whatsapp_link'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    /**
     * Get the UMKM profile that owns the reel.
     */
    public function umkmProfile(): BelongsTo
    {
        return $this->belongsTo(UmkmProfile::class);
    }

    /**
     * Get the engagement events for the reel.
     */
    public function engagementEvents(): HasMany
    {
        return $this->hasMany(EngagementEvent::class);
    }

    /**
     * Get the WhatsApp link with pre-filled message template.
     */
    public function getWhatsappLinkAttribute(): string
    {
        $profile = $this->umkmProfile;
        
        if (!$profile) {
            return '';
        }

        $phone = $profile->nomor_wa;
        
        // Convert 08xx to 628xx format for WhatsApp
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        $message = urlencode("Halo {$profile->nama_toko}, saya tertarik dengan produk {$this->product_name}");
        
        return "https://wa.me/{$phone}?text={$message}";
    }
}
