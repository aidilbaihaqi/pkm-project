<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UmkmProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_toko',
        'nomor_wa',
        'alamat',
        'latitude',
        'longitude',
        'kategori',
        'deskripsi',
        'avatar',
        'is_open',
        'open_hours',
        'is_blocked',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_open' => 'boolean',
            'is_blocked' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the UMKM profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reels for the UMKM profile.
     */
    public function reels(): HasMany
    {
        return $this->hasMany(Reel::class);
    }

    /**
     * Get the avatar URL.
     * Accessor for avatar attribute.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (empty($this->avatar)) {
            return null;
        }

        // If already a full URL, return as-is
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        // If it's a storage path, return full URL
        if (str_starts_with($this->avatar, '/storage')) {
            return url($this->avatar);
        }

        return $this->avatar;
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['avatar_url'];
}
