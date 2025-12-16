<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat admin user (untuk development)
        // Catatan: Di production, admin dibuat manual atau via WorkOS
        // User::create([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        //     'role' => User::ROLE_ADMIN,
        //     'workos_id' => 'admin_placeholder',
        //     'avatar' => '',
        //     'email_verified_at' => now(),
        // ]);
    }
}
