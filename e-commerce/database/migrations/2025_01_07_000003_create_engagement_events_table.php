<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('engagement_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reel_id')->constrained('reels')->onDelete('cascade');
            $table->string('user_identifier', 64)->nullable();
            $table->enum('event_type', ['view', 'like', 'share', 'click_wa']);
            $table->timestamp('created_at')->nullable();

            // Indexes for query optimization
            $table->index(['reel_id', 'event_type'], 'idx_reel_event');
            $table->index(['user_identifier', 'reel_id', 'event_type', 'created_at'], 'idx_user_reel_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_events');
    }
};
