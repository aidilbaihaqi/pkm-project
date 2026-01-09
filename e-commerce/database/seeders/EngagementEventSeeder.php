<?php

namespace Database\Seeders;

use App\Models\EngagementEvent;
use App\Models\Reel;
use Illuminate\Database\Seeder;

class EngagementEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reels = Reel::all();

        foreach ($reels as $reel) {
            // Generate random engagement for each reel
            $viewCount = rand(100, 5000);
            $likeCount = rand(10, (int)($viewCount * 0.3)); // 0-30% of views
            $shareCount = rand(0, (int)($viewCount * 0.05)); // 0-5% of views
            $clickWaCount = rand(5, (int)($viewCount * 0.1)); // 0-10% of views

            // Create view events
            for ($i = 0; $i < min($viewCount, 500); $i++) { // Limit to 500 per reel for performance
                EngagementEvent::create([
                    'reel_id' => $reel->id,
                    'user_identifier' => $this->generateUserIdentifier(),
                    'event_type' => EngagementEvent::TYPE_VIEW,
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }

            // Create like events
            for ($i = 0; $i < min($likeCount, 150); $i++) {
                EngagementEvent::create([
                    'reel_id' => $reel->id,
                    'user_identifier' => $this->generateUserIdentifier(),
                    'event_type' => EngagementEvent::TYPE_LIKE,
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }

            // Create share events
            for ($i = 0; $i < min($shareCount, 25); $i++) {
                EngagementEvent::create([
                    'reel_id' => $reel->id,
                    'user_identifier' => $this->generateUserIdentifier(),
                    'event_type' => EngagementEvent::TYPE_SHARE,
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }

            // Create WhatsApp click events
            for ($i = 0; $i < min($clickWaCount, 50); $i++) {
                EngagementEvent::create([
                    'reel_id' => $reel->id,
                    'user_identifier' => $this->generateUserIdentifier(),
                    'event_type' => EngagementEvent::TYPE_CLICK_WA,
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                ]);
            }
        }
    }

    /**
     * Generate a random user identifier (simulating anonymous users)
     */
    private function generateUserIdentifier(): string
    {
        $types = ['ip', 'session', 'fingerprint'];
        $type = $types[array_rand($types)];

        return match ($type) {
            'ip' => rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255),
            'session' => 'sess_' . bin2hex(random_bytes(16)),
            'fingerprint' => 'fp_' . bin2hex(random_bytes(12)),
        };
    }
}
