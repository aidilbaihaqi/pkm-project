<?php

namespace Database\Factories;

use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UmkmProfile>
 */
class UmkmProfileFactory extends Factory
{
    protected $model = UmkmProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nama_toko' => fake()->company(),
            'nomor_wa' => '08' . fake()->numerify('##########'),
            'alamat' => fake()->address(),
            'latitude' => fake()->latitude(-8.5, -6.0),
            'longitude' => fake()->longitude(106.0, 112.0),
            'kategori' => fake()->randomElement(['makanan', 'minuman', 'fashion', 'elektronik', 'jasa']),
            'deskripsi' => fake()->paragraph(),
            'avatar' => null,
            'is_open' => true,
            'open_hours' => '08:00-21:00',
            'is_blocked' => false,
        ];
    }

    /**
     * Indicate that the profile is blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_blocked' => true,
        ]);
    }
}
