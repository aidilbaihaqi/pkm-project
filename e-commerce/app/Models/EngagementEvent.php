<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementEvent extends Model
{
    use HasFactory;

    /**
     * Event type constants.
     */
    public const TYPE_VIEW = 'view';
    public const TYPE_LIKE = 'like';
    public const TYPE_SHARE = 'share';
    public const TYPE_CLICK_WA = 'click_wa';

    /**
     * All valid event types.
     */
    public const VALID_TYPES = [
        self::TYPE_VIEW,
        self::TYPE_LIKE,
        self::TYPE_SHARE,
        self::TYPE_CLICK_WA,
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reel_id',
        'user_identifier',
        'event_type',
        'created_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the reel that the engagement event belongs to.
     */
    public function reel(): BelongsTo
    {
        return $this->belongsTo(Reel::class);
    }
}
