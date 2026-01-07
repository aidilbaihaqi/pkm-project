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
}
