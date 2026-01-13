<?php

namespace App\Models;

use App\Services\WhatsAppService;
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
    protected $appends = ['whatsapp_link', 'views_count'];

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
     * Uses WhatsAppService for link generation.
     */
    public function getWhatsappLinkAttribute(): string
    {
        $profile = $this->umkmProfile;
        
        if (!$profile) {
            return '';
        }

        $whatsAppService = app(WhatsAppService::class);
        
        return $whatsAppService->generateLink(
            $profile->nomor_wa,
            $this->product_name,
            $profile->nama_toko
        );
    }

    /**
     * Get the views count for the reel.
     * Counts engagement events with type 'view'.
     */
    public function getViewsCountAttribute(): int
    {
        return $this->engagementEvents()->where('event_type', 'view')->count();
    }
}
