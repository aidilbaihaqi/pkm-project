<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            UmkmProfileSeeder::class,
            ReelSeeder::class,
            EngagementEventSeeder::class,
        ]);

        $this->command->info('✅ Database seeding completed!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   - 1 Admin user (admin@umkmku.com)');
        $this->command->info('   - 10 Seller users with UMKM profiles');
        $this->command->info('   - 40+ Reels with YouTube videos');
        $this->command->info('   - Engagement events (views, likes, shares, WA clicks)');
        $this->command->info('');
        $this->command->info('🔐 Login credentials:');
        $this->command->info('   Admin: admin@umkmku.com (via WorkOS)');
        $this->command->info('   Sellers: butini@gmail.com, pakjoko@gmail.com, etc. (via WorkOS)');
    }
}
