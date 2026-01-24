<?php

namespace Database\Seeders;

use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class UmkmProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profiles = [
            [
                'email' => 'butini@gmail.com',
                'nama_toko' => 'Warung Gudeg Bu Tini',
                'nomor_wa' => '6281234567890',
                'alamat' => 'Jl. Merdeka No. 45, Tanjungpinang',
                'latitude' => 0.9183,
                'longitude' => 104.4585,
                'kategori' => 'Makanan',
                'deskripsi' => 'Menyediakan gudeg asli Jogja dengan resep turun temurun sejak 1980. Spesial Gudeg Yu Djum style dengan krecek pedas dan areh gurih. Tersedia paket nasi gudeg komplit dan gudeg kaleng untuk oleh-oleh.',
                'is_open' => true,
                'open_hours' => '06:00 - 14:00',
            ],
            [
                'email' => 'pakjoko@gmail.com',
                'nama_toko' => 'Bakso Pak Joko',
                'nomor_wa' => '6282345678901',
                'alamat' => 'Jl. Basuki Rahmat No. 78, Tanjungpinang',
                'latitude' => 0.9225,
                'longitude' => 104.4512,
                'kategori' => 'Makanan',
                'deskripsi' => 'Bakso urat jumbo dengan kuah kaldu sapi pilihan. Tersedia bakso urat, bakso halus, bakso telur, dan mie ayam. Porsi besar, harga terjangkau!',
                'is_open' => true,
                'open_hours' => '10:00 - 21:00',
            ],
            [
                'email' => 'ibusari@gmail.com',
                'nama_toko' => 'Batik Sari Indah',
                'nomor_wa' => '6283456789012',
                'alamat' => 'Jl. Hang Tuah No. 23, Tanjungpinang',
                'latitude' => 0.9156,
                'longitude' => 104.4623,
                'kategori' => 'Fashion',
                'deskripsi' => 'Pusat batik tulis dan cap berkualitas tinggi. Menyediakan berbagai motif batik khas Kepri dan Melayu. Tersedia juga batik modern untuk anak muda dengan sentuhan budaya lokal.',
                'is_open' => true,
                'open_hours' => '09:00 - 20:00',
            ],
            [
                'email' => 'masbudi@gmail.com',
                'nama_toko' => 'Kopi Nusantara Mas Budi',
                'nomor_wa' => '6284567890123',
                'alamat' => 'Jl. Teuku Umar No. 12, Tanjungpinang',
                'latitude' => 0.9198,
                'longitude' => 104.4567,
                'kategori' => 'Minuman',
                'deskripsi' => 'Kedai kopi specialty dengan biji kopi pilihan dari berbagai daerah Indonesia. Manual brew, espresso based, dan signature drinks. Suasana cozy untuk nongkrong dan kerja dengan view laut.',
                'is_open' => true,
                'open_hours' => '08:00 - 23:00',
            ],
            [
                'email' => 'mbakdewi@gmail.com',
                'nama_toko' => 'Kerajinan Perak Dewi',
                'nomor_wa' => '6285678901234',
                'alamat' => 'Jl. Diponegoro No. 89, Tanjungpinang',
                'latitude' => 0.9134,
                'longitude' => 104.4598,
                'kategori' => 'Kerajinan',
                'deskripsi' => 'Kerajinan perak handmade khas Kepulauan Riau. Cincin, gelang, kalung, dan anting dengan desain tradisional Melayu dan modern. Bisa custom sesuai permintaan.',
                'is_open' => true,
                'open_hours' => '08:00 - 17:00',
            ],
            [
                'email' => 'pakhendra@gmail.com',
                'nama_toko' => 'Sate Klathak Pak Hendra',
                'nomor_wa' => '6286789012345',
                'alamat' => 'Jl. Pos No. 56, Tanjungpinang',
                'latitude' => 0.9167,
                'longitude' => 104.4534,
                'kategori' => 'Makanan',
                'deskripsi' => 'Sate klathak kambing muda asli Bantul. Daging empuk, bumbu meresap, dibakar dengan arang kelapa. Tersedia juga tongseng dan gulai kambing khas Kepri.',
                'is_open' => true,
                'open_hours' => '17:00 - 23:00',
            ],
            [
                'email' => 'buratna@gmail.com',
                'nama_toko' => 'Jamu Bu Ratna',
                'nomor_wa' => '6287890123456',
                'alamat' => 'Jl. Gatot Subroto No. 34, Tanjungpinang',
                'latitude' => 0.9211,
                'longitude' => 104.4489,
                'kategori' => 'Minuman',
                'deskripsi' => 'Jamu tradisional racikan sendiri dengan bahan alami pilihan. Beras kencur, kunyit asam, temulawak, dan berbagai jamu kesehatan lainnya. Segar dan menyehatkan!',
                'is_open' => true,
                'open_hours' => '06:00 - 18:00',
            ],
            [
                'email' => 'masagus@gmail.com',
                'nama_toko' => 'Elektronik Mas Agus',
                'nomor_wa' => '6288901234567',
                'alamat' => 'Jl. Ahmad Yani No. 101, Tanjungpinang',
                'latitude' => 0.9189,
                'longitude' => 104.4612,
                'kategori' => 'Elektronik',
                'deskripsi' => 'Service dan jual beli elektronik. Spesialis perbaikan HP, laptop, dan gadget. Spare part original dan KW berkualitas. Garansi service 1 bulan.',
                'is_open' => true,
                'open_hours' => '09:00 - 21:00',
            ],
            [
                'email' => 'ibuwati@gmail.com',
                'nama_toko' => 'Kue Tradisional Bu Wati',
                'nomor_wa' => '6289012345678',
                'alamat' => 'Jl. Sudirman No. 67, Tanjungpinang',
                'latitude' => 0.9145,
                'longitude' => 104.4556,
                'kategori' => 'Makanan',
                'deskripsi' => 'Aneka kue tradisional Melayu dan Jawa homemade. Klepon, onde-onde, getuk, lupis, dan jajan pasar lainnya. Fresh setiap hari, cocok untuk acara dan oleh-oleh.',
                'is_open' => true,
                'open_hours' => '05:00 - 12:00',
            ],
            [
                'email' => 'pakdarmawan@gmail.com',
                'nama_toko' => 'Furniture Jati Pak Darmawan',
                'nomor_wa' => '6280123456789',
                'alamat' => 'Jl. Bintan No. 88, Bintan',
                'latitude' => 1.0456,
                'longitude' => 104.4523,
                'kategori' => 'Furniture',
                'deskripsi' => 'Furniture kayu jati berkualitas tinggi. Meja, kursi, lemari, dan tempat tidur dengan desain klasik dan minimalis. Bisa custom sesuai ukuran dan desain.',
                'is_open' => true,
                'open_hours' => '08:00 - 17:00',
            ],
        ];

        foreach ($profiles as $profile) {
            $user = User::where('email', $profile['email'])->first();
            if ($user) {
                UmkmProfile::create([
                    'user_id' => $user->id,
                    'nama_toko' => $profile['nama_toko'],
                    'nomor_wa' => $profile['nomor_wa'],
                    'alamat' => $profile['alamat'],
                    'latitude' => $profile['latitude'],
                    'longitude' => $profile['longitude'],
                    'kategori' => $profile['kategori'],
                    'deskripsi' => $profile['deskripsi'],
                    'avatar' => $user->avatar,
                    'is_open' => $profile['is_open'],
                    'open_hours' => $profile['open_hours'],
                    'is_blocked' => false,
                ]);
            }
        }
    }
}
