<?php

namespace Database\Factories;

use App\Models\Reel;
use App\Models\UmkmProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reel>
 */
class ReelFactory extends Factory
{
    protected $model = Reel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $videoIds = ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk', 'fJ9rUzIMcZQ'];
        $videoId = fake()->randomElement($videoIds);

        return [
            'umkm_profile_id' => UmkmProfile::factory(),
            'video_url' => 'https://www.youtube.com/watch?v=' . $videoId,
            'thumbnail_url' => 'https://img.youtube.com/vi/' . $videoId . '/maxresdefault.jpg',
            'product_name' => fake()->words(3, true),
            'caption' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 10000, 1000000),
            'kategori' => fake()->randomElement(['makanan', 'minuman', 'fashion', 'elektronik', 'jasa']),
            'type' => 'video',
            'status' => 'published',
        ];
    }

    /**
     * Indicate that the reel is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the reel is an image type.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'image',
            'video_url' => null,
        ]);
    }
}
