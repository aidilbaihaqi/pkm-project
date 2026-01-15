<?php

namespace Database\Factories;

use App\Models\EngagementEvent;
use App\Models\Reel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EngagementEvent>
 */
class EngagementEventFactory extends Factory
{
    protected $model = EngagementEvent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reel_id' => Reel::factory(),
            'user_identifier' => 'ip:' . fake()->ipv4(),
            'event_type' => fake()->randomElement(EngagementEvent::VALID_TYPES),
            'created_at' => now(),
        ];
    }

    /**
     * Indicate that the event is a view.
     */
    public function view(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => EngagementEvent::TYPE_VIEW,
        ]);
    }

    /**
     * Indicate that the event is a like.
     */
    public function like(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => EngagementEvent::TYPE_LIKE,
        ]);
    }

    /**
     * Indicate that the event is a share.
     */
    public function share(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => EngagementEvent::TYPE_SHARE,
        ]);
    }

    /**
     * Indicate that the event is a WhatsApp click.
     */
    public function clickWa(): static
    {
        return $this->state(fn (array $attributes) => [
            'event_type' => EngagementEvent::TYPE_CLICK_WA,
        ]);
    }

    /**
     * Set a specific user identifier.
     */
    public function forUser(string $identifier): static
    {
        return $this->state(fn (array $attributes) => [
            'user_identifier' => $identifier,
        ]);
    }
}
