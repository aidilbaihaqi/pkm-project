<?php

namespace Database\Seeders;

use App\Models\Reel;
use App\Models\UmkmProfile;
use Illuminate\Database\Seeder;

class ReelSeeder extends Seeder
{
    /**
     * Valid YouTube video URLs for food/UMKM content
     */
    private array $youtubeVideos = [
        // Food videos
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=9bZkp7q19f0',
        'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        'https://www.youtube.com/watch?v=RgKAFK5djSk',
        'https://www.youtube.com/watch?v=JGwWNGJdvx8',
        'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
        'https://www.youtube.com/watch?v=CevxZvSJLk8',
        'https://www.youtube.com/watch?v=hT_nvWreIhg',
        'https://www.youtube.com/watch?v=YQHsXMglC9A',
        'https://www.youtube.com/watch?v=OPf0YbXqDm0',
        'https://www.youtube.com/watch?v=pRpeEdMmmQ0',
        'https://www.youtube.com/watch?v=09R8_2nJtjg',
        'https://www.youtube.com/watch?v=7PCkvCPvDXk',
        'https://www.youtube.com/watch?v=kXYiU_JCYtU',
        'https://www.youtube.com/watch?v=lp-EO5I60KA',
        'https://www.youtube.com/watch?v=e-ORhEE9VVg',
        'https://www.youtube.com/watch?v=SlPhMPnQ58k',
        'https://www.youtube.com/watch?v=pt8VYOfr8To',
        'https://www.youtube.com/watch?v=nfWlot6h_JM',
        'https://www.youtube.com/watch?v=60ItHLz5WEA',
    ];

    /**
     * Thumbnail URLs from Unsplash
     */
    private array $thumbnails = [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1482049016gy-2d1ec7ab7445?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=600&fit=crop',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profiles = UmkmProfile::all();

        foreach ($profiles as $profile) {
            $reels = $this->getReelsForProfile($profile);
            
            foreach ($reels as $reel) {
                Reel::create([
                    'umkm_profile_id' => $profile->id,
                    'video_url' => $reel['video_url'],
                    'thumbnail_url' => $reel['thumbnail_url'],
                    'product_name' => $reel['product_name'],
                    'caption' => $reel['caption'],
                    'price' => $reel['price'],
                    'kategori' => $profile->kategori,
                    'type' => 'video',
                    'status' => 'published',
                    'created_at' => now()->subDays(rand(1, 30))->subHours(rand(1, 23)),
                ]);
            }
        }
    }

    private function getReelsForProfile(UmkmProfile $profile): array
    {
        $reelsByStore = [
            'Warung Gudeg Bu Tini' => [
                [
                    'product_name' => 'Gudeg Komplit',
                    'caption' => 'Gudeg komplit dengan ayam kampung, telur, krecek, dan tahu tempe bacem. Resep turun temurun sejak 1980! 🍛 #gudeg #jogja #kuliner',
                    'price' => 25000,
                ],
                [
                    'product_name' => 'Gudeg Manggar',
                    'caption' => 'Gudeg manggar spesial dengan bunga kelapa muda. Rasa manis gurih yang bikin nagih! 😋 #gudegmanggar #kulinerjogja',
                    'price' => 30000,
                ],
                [
                    'product_name' => 'Paket Nasi Gudeg',
                    'caption' => 'Paket hemat nasi gudeg untuk keluarga. Isi 4 porsi lengkap dengan lauk! 👨‍👩‍👧‍👦 #paketnasigudeg',
                    'price' => 85000,
                ],
                [
                    'product_name' => 'Gudeg Kaleng',
                    'caption' => 'Gudeg kaleng untuk oleh-oleh. Tahan lama, praktis dibawa pulang! 🎁 #gudegkaleng #oleholeh',
                    'price' => 45000,
                ],
                [
                    'product_name' => 'Krecek Pedas',
                    'caption' => 'Krecek pedas tambahan untuk pecinta pedas! Level 1-5 tersedia 🌶️ #krecekpedas #pedasgila',
                    'price' => 10000,
                ],
            ],
            'Bakso Pak Joko' => [
                [
                    'product_name' => 'Bakso Urat Jumbo',
                    'caption' => 'Bakso urat jumbo sebesar kepalan tangan! Daging sapi pilihan, kenyal dan gurih 🥩 #baksojumbo #baksourat',
                    'price' => 20000,
                ],
                [
                    'product_name' => 'Bakso Beranak',
                    'caption' => 'Bakso beranak isi telur puyuh dan daging cincang. Satu gigit, double nikmat! 🥚 #baksoberanak',
                    'price' => 25000,
                ],
                [
                    'product_name' => 'Mie Ayam Spesial',
                    'caption' => 'Mie ayam dengan topping ayam cincang melimpah dan pangsit goreng renyah 🍜 #mieayam #kuliner',
                    'price' => 18000,
                ],
                [
                    'product_name' => 'Bakso Campur',
                    'caption' => 'Bakso campur: urat, halus, telur, dan tahu bakso dalam satu mangkok! 🍲 #baksocampur',
                    'price' => 22000,
                ],
            ],
            'Batik Sari Indah' => [
                [
                    'product_name' => 'Batik Tulis Parang',
                    'caption' => 'Batik tulis motif Parang klasik. Proses pembuatan 2-3 bulan dengan pewarna alami 🎨 #batiktulis #batikjogja',
                    'price' => 850000,
                ],
                [
                    'product_name' => 'Kemeja Batik Modern',
                    'caption' => 'Kemeja batik slim fit untuk anak muda. Motif kontemporer, nyaman dipakai! 👔 #batikmodern #ootd',
                    'price' => 175000,
                ],
                [
                    'product_name' => 'Dress Batik Wanita',
                    'caption' => 'Dress batik elegan untuk acara formal. Cutting modern, motif tradisional 👗 #dressbatik #fashion',
                    'price' => 250000,
                ],
                [
                    'product_name' => 'Kain Batik Cap',
                    'caption' => 'Kain batik cap 2 meter. Cocok untuk bawahan atau dijahit sendiri! 📏 #kainbatik #batikcap',
                    'price' => 125000,
                ],
                [
                    'product_name' => 'Set Batik Couple',
                    'caption' => 'Set batik couple untuk pasangan. Tampil kompak di acara keluarga! 💑 #batikcouple #kondangan',
                    'price' => 350000,
                ],
            ],
            'Kopi Nusantara Mas Budi' => [
                [
                    'product_name' => 'Kopi Gayo V60',
                    'caption' => 'Single origin Gayo Aceh, manual brew V60. Notes: chocolate, nutty, clean finish ☕ #kopigayo #v60',
                    'price' => 28000,
                ],
                [
                    'product_name' => 'Es Kopi Susu',
                    'caption' => 'Es kopi susu signature dengan gula aren asli. Manis pas, creamy! 🧊 #eskopisusu #kopikekinian',
                    'price' => 22000,
                ],
                [
                    'product_name' => 'Affogato',
                    'caption' => 'Espresso shot dituang di atas gelato vanilla. Perpaduan pahit dan manis yang sempurna! 🍨 #affogato',
                    'price' => 35000,
                ],
                [
                    'product_name' => 'Cold Brew 1 Liter',
                    'caption' => 'Cold brew 24 jam dalam botol 1 liter. Stock kopi untuk seminggu! 🍶 #coldbrew #kopibotol',
                    'price' => 75000,
                ],
            ],
            'Kerajinan Perak Dewi' => [
                [
                    'product_name' => 'Cincin Perak Ukir',
                    'caption' => 'Cincin perak 925 dengan ukiran tradisional Kotagede. Handmade, bisa custom nama! 💍 #cincinperak #handmade',
                    'price' => 150000,
                ],
                [
                    'product_name' => 'Gelang Perak Bali',
                    'caption' => 'Gelang perak motif Bali dengan detail ukiran halus. Cocok untuk pria dan wanita 📿 #gelangperak',
                    'price' => 275000,
                ],
                [
                    'product_name' => 'Kalung Liontin',
                    'caption' => 'Kalung perak dengan liontin custom. Bisa request bentuk dan ukuran! ✨ #kalungperak #custom',
                    'price' => 200000,
                ],
                [
                    'product_name' => 'Anting Mutiara',
                    'caption' => 'Anting perak dengan mutiara air tawar asli. Elegan untuk acara formal 👂 #antingperak #mutiara',
                    'price' => 185000,
                ],
            ],
            'Sate Klathak Pak Hendra' => [
                [
                    'product_name' => 'Sate Klathak Kambing',
                    'caption' => 'Sate klathak kambing muda 10 tusuk. Empuk, bumbu meresap, dibakar arang kelapa! 🍢 #sateklathak #bantul',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Tongseng Kambing',
                    'caption' => 'Tongseng kambing dengan kuah santan kental dan kol. Hangat dan nikmat! 🍲 #tongseng #kulinerbantul',
                    'price' => 35000,
                ],
                [
                    'product_name' => 'Gulai Kambing',
                    'caption' => 'Gulai kambing khas Jawa dengan rempah pilihan. Cocok dengan nasi hangat! 🥘 #gulaikambing',
                    'price' => 40000,
                ],
                [
                    'product_name' => 'Paket Keluarga',
                    'caption' => 'Paket keluarga: 30 tusuk sate + 2 tongseng + nasi 4 porsi. Hemat untuk makan bersama! 👨‍👩‍👧‍👦 #paketkeluarga',
                    'price' => 175000,
                ],
            ],
            'Jamu Bu Ratna' => [
                [
                    'product_name' => 'Beras Kencur',
                    'caption' => 'Jamu beras kencur segar untuk stamina dan nafsu makan. Racikan tradisional! 🌿 #beraskencur #jamu',
                    'price' => 8000,
                ],
                [
                    'product_name' => 'Kunyit Asam',
                    'caption' => 'Kunyit asam untuk melancarkan haid dan menjaga kesehatan kulit. Segar dan menyehatkan! 💛 #kunyitasam',
                    'price' => 8000,
                ],
                [
                    'product_name' => 'Temulawak',
                    'caption' => 'Jamu temulawak untuk kesehatan liver dan pencernaan. Pahit tapi berkhasiat! 🍃 #temulawak #sehat',
                    'price' => 10000,
                ],
                [
                    'product_name' => 'Paket Jamu Sehat',
                    'caption' => 'Paket 5 botol jamu campur untuk seminggu. Jaga kesehatan keluarga! 🏠 #paketjamu #sehatkeluarga',
                    'price' => 35000,
                ],
            ],
            'Elektronik Mas Agus' => [
                [
                    'product_name' => 'Service HP',
                    'caption' => 'Service HP segala merk. Ganti LCD, baterai, charging port. Garansi 1 bulan! 📱 #servicehp #teknisi',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Ganti LCD iPhone',
                    'caption' => 'Ganti LCD iPhone original dan KW super. Proses cepat, hasil rapi! 🍎 #lcdiphone #sparepartiphone',
                    'price' => 350000,
                ],
                [
                    'product_name' => 'Service Laptop',
                    'caption' => 'Service laptop: install ulang, ganti keyboard, upgrade RAM/SSD. Semua merk! 💻 #servicelaptop',
                    'price' => 100000,
                ],
                [
                    'product_name' => 'Aksesoris HP',
                    'caption' => 'Jual aksesoris HP: case, tempered glass, charger, earphone. Harga grosir! 🎧 #aksesoriship',
                    'price' => 25000,
                ],
            ],
            'Kue Tradisional Bu Wati' => [
                [
                    'product_name' => 'Klepon',
                    'caption' => 'Klepon isi gula merah dengan taburan kelapa parut. Mledos di mulut! 🟢 #klepon #jajanpasar',
                    'price' => 15000,
                ],
                [
                    'product_name' => 'Onde-onde',
                    'caption' => 'Onde-onde wijen isi kacang hijau. Renyah di luar, lembut di dalam! 🟡 #ondeonde #kuetradisional',
                    'price' => 18000,
                ],
                [
                    'product_name' => 'Getuk Lindri',
                    'caption' => 'Getuk lindri warna-warni dari singkong pilihan. Manis legit! 🌈 #getuklindri #kuejawa',
                    'price' => 12000,
                ],
                [
                    'product_name' => 'Paket Jajan Pasar',
                    'caption' => 'Paket jajan pasar isi 20 pcs campur. Cocok untuk arisan dan pengajian! 📦 #jajanpasar #snackbox',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Lupis',
                    'caption' => 'Lupis ketan dengan siraman gula merah dan kelapa parut. Kenyal dan manis! 🍡 #lupis #kuetradisional',
                    'price' => 10000,
                ],
            ],
            'Furniture Jati Pak Darmawan' => [
                [
                    'product_name' => 'Meja Makan Jati',
                    'caption' => 'Meja makan jati 6 kursi. Kayu jati TPK grade A, finishing natural. Awet puluhan tahun! 🪑 #mejamakan #furniturjati',
                    'price' => 8500000,
                ],
                [
                    'product_name' => 'Lemari Pakaian',
                    'caption' => 'Lemari pakaian 3 pintu kayu jati. Desain klasik dengan ukiran Jepara 🚪 #lemarijati #furnitur',
                    'price' => 12000000,
                ],
                [
                    'product_name' => 'Tempat Tidur Minimalis',
                    'caption' => 'Tempat tidur minimalis kayu jati ukuran queen. Simple tapi elegan! 🛏️ #tempattidur #minimalis',
                    'price' => 6500000,
                ],
                [
                    'product_name' => 'Kursi Tamu Set',
                    'caption' => 'Set kursi tamu 3-2-1 dengan meja. Cocok untuk ruang tamu modern! 🛋️ #kursitamu #livingroom',
                    'price' => 15000000,
                ],
            ],
        ];

        $storeReels = $reelsByStore[$profile->nama_toko] ?? [];
        $result = [];

        foreach ($storeReels as $index => $reel) {
            $result[] = [
                'video_url' => $this->youtubeVideos[array_rand($this->youtubeVideos)],
                'thumbnail_url' => $this->thumbnails[$index % count($this->thumbnails)],
                'product_name' => $reel['product_name'],
                'caption' => $reel['caption'],
                'price' => $reel['price'],
            ];
        }

        return $result;
    }
}
