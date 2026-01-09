<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin UMKMku',
            'email' => 'admin@umkmku.com',
            'role' => User::ROLE_ADMIN,
            'workos_id' => 'admin_dev_001',
            'avatar' => 'https://ui-avatars.com/api/?name=Admin&background=FF6B35&color=fff',
            'email_verified_at' => now(),
        ]);

        // Seller users
        $sellers = [
            [
                'name' => 'Bu Tini',
                'email' => 'butini@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Bu+Tini&background=10B981&color=fff',
            ],
            [
                'name' => 'Pak Joko',
                'email' => 'pakjoko@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Pak+Joko&background=3B82F6&color=fff',
            ],
            [
                'name' => 'Ibu Sari',
                'email' => 'ibusari@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Ibu+Sari&background=8B5CF6&color=fff',
            ],
            [
                'name' => 'Mas Budi',
                'email' => 'masbudi@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Mas+Budi&background=EC4899&color=fff',
            ],
            [
                'name' => 'Mbak Dewi',
                'email' => 'mbakdewi@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Mbak+Dewi&background=F59E0B&color=fff',
            ],
            [
                'name' => 'Pak Hendra',
                'email' => 'pakhendra@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Pak+Hendra&background=EF4444&color=fff',
            ],
            [
                'name' => 'Bu Ratna',
                'email' => 'buratna@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Bu+Ratna&background=14B8A6&color=fff',
            ],
            [
                'name' => 'Mas Agus',
                'email' => 'masagus@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Mas+Agus&background=6366F1&color=fff',
            ],
            [
                'name' => 'Ibu Wati',
                'email' => 'ibuwati@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Ibu+Wati&background=84CC16&color=fff',
            ],
            [
                'name' => 'Pak Darmawan',
                'email' => 'pakdarmawan@gmail.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Pak+Darmawan&background=F97316&color=fff',
            ],
        ];

        foreach ($sellers as $index => $seller) {
            User::create([
                'name' => $seller['name'],
                'email' => $seller['email'],
                'role' => User::ROLE_SELLER,
                'workos_id' => 'seller_dev_' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'avatar' => $seller['avatar'],
                'email_verified_at' => now(),
            ]);
        }
    }
}
