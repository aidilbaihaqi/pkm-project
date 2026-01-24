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
        "https://www.youtube.com/shorts/7qNbfEULbGM",
        "https://www.youtube.com/shorts/Cfh7b-Wz_m4",
        "https://www.youtube.com/shorts/4s864ZuQt_k",
        "https://www.youtube.com/shorts/2_W6-e6L-vM",
        "https://www.youtube.com/shorts/b9D6A_1R7z8",
        "https://www.youtube.com/shorts/vR_7Xp_9L0",
        "https://www.youtube.com/shorts/N-ShHwPyWz8",
        "https://www.youtube.com/shorts/k9H7OQvM_I0",
        "https://www.youtube.com/shorts/o1HIkxpMtEU",
        "https://www.youtube.com/shorts/VVrPFDGSGsU",
        "https://www.youtube.com/shorts/0O9Ln2RDyxs",
        "https://www.youtube.com/shorts/gfFR3D_Ey6o",
        "https://www.youtube.com/shorts/X1jL-3KzL2w",
        "https://www.youtube.com/shorts/Past5cLYq6E",
        "https://www.youtube.com/shorts/_kqb3D9t1AQ",
        "https://www.youtube.com/shorts/qSZVGNEtFo8",
        "https://www.youtube.com/shorts/6c9Srw1QWfg",
        "https://www.youtube.com/shorts/hKCed20ILuA",
        "https://www.youtube.com/shorts/Gs3rbkhDJzA",
        "https://www.youtube.com/shorts/7HElSEmGY5s",
        "https://www.youtube.com/shorts/5iM2B_Lp7wQ",
        "https://www.youtube.com/shorts/L-3Zp9X_Jm4",
        "https://www.youtube.com/shorts/EefU02w1Bf4",
        "https://www.youtube.com/shorts/Qfrq8QvSQXE",
        "https://www.youtube.com/shorts/jE0waS-kPow",
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
                    'caption' => 'Gudeg komplit dengan ayam kampung, telur, krecek, dan tahu tempe bacem. Resep turun temurun sejak 1980! Hadir di Tanjungpinang! 🍛 #gudeg #tanjungpinang #kuliner',
                    'price' => 25000,
                ],
                [
                    'product_name' => 'Gudeg Manggar',
                    'caption' => 'Gudeg manggar spesial dengan bunga kelapa muda. Rasa manis gurih yang bikin nagih! 😋 #gudegmanggar #kulinerkepri',
                    'price' => 30000,
                ],
                [
                    'product_name' => 'Paket Nasi Gudeg',
                    'caption' => 'Paket hemat nasi gudeg untuk keluarga. Isi 4 porsi lengkap dengan lauk! 👨‍👩‍👧‍👦 #paketnasigudeg #tanjungpinang',
                    'price' => 85000,
                ],
                [
                    'product_name' => 'Gudeg Kaleng',
                    'caption' => 'Gudeg kaleng untuk oleh-oleh khas Kepri. Tahan lama, praktis dibawa pulang! 🎁 #gudegkaleng #oleholehkepri',
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
                    'caption' => 'Bakso urat jumbo sebesar kepalan tangan! Daging sapi pilihan, kenyal dan gurih. Favorit warga Tanjungpinang! 🥩 #baksojumbo #baksourat #tanjungpinang',
                    'price' => 20000,
                ],
                [
                    'product_name' => 'Bakso Beranak',
                    'caption' => 'Bakso beranak isi telur puyuh dan daging cincang. Satu gigit, double nikmat! 🥚 #baksoberanak #kulinerkepri',
                    'price' => 25000,
                ],
                [
                    'product_name' => 'Mie Ayam Spesial',
                    'caption' => 'Mie ayam dengan topping ayam cincang melimpah dan pangsit goreng renyah 🍜 #mieayam #kulinertanjungpinang',
                    'price' => 18000,
                ],
                [
                    'product_name' => 'Bakso Campur',
                    'caption' => 'Bakso campur: urat, halus, telur, dan tahu bakso dalam satu mangkok! 🍲 #baksocampur #kepri',
                    'price' => 22000,
                ],
            ],
            'Batik Sari Indah' => [
                [
                    'product_name' => 'Batik Tulis Melayu',
                    'caption' => 'Batik tulis motif Melayu klasik khas Kepri. Proses pembuatan 2-3 bulan dengan pewarna alami 🎨 #batiktulis #batikkepri #batikmelayu',
                    'price' => 850000,
                ],
                [
                    'product_name' => 'Kemeja Batik Modern',
                    'caption' => 'Kemeja batik slim fit untuk anak muda. Motif kontemporer Kepulauan Riau, nyaman dipakai! 👔 #batikmodern #ootd #tanjungpinang',
                    'price' => 175000,
                ],
                [
                    'product_name' => 'Dress Batik Wanita',
                    'caption' => 'Dress batik elegan untuk acara formal. Cutting modern, motif tradisional Melayu 👗 #dressbatik #fashionkepri',
                    'price' => 250000,
                ],
                [
                    'product_name' => 'Kain Batik Cap',
                    'caption' => 'Kain batik cap 2 meter motif khas Kepri. Cocok untuk bawahan atau dijahit sendiri! 📏 #kainbatik #batikcap',
                    'price' => 125000,
                ],
                [
                    'product_name' => 'Set Batik Couple',
                    'caption' => 'Set batik couple untuk pasangan. Tampil kompak di acara keluarga dengan batik Melayu! 💑 #batikcouple #batikmelayu',
                    'price' => 350000,
                ],
            ],
            'Kopi Nusantara Mas Budi' => [
                [
                    'product_name' => 'Kopi Gayo V60',
                    'caption' => 'Single origin Gayo Aceh, manual brew V60. Notes: chocolate, nutty, clean finish. Nikmati dengan view laut Tanjungpinang! ☕ #kopigayo #v60 #kopitanjungpinang',
                    'price' => 28000,
                ],
                [
                    'product_name' => 'Es Kopi Susu',
                    'caption' => 'Es kopi susu signature dengan gula aren asli. Manis pas, creamy! Cocok untuk cuaca Kepri! 🧊 #eskopisusu #kopikekinian #kepri',
                    'price' => 22000,
                ],
                [
                    'product_name' => 'Affogato',
                    'caption' => 'Espresso shot dituang di atas gelato vanilla. Perpaduan pahit dan manis yang sempurna! 🍨 #affogato #tanjungpinang',
                    'price' => 35000,
                ],
                [
                    'product_name' => 'Cold Brew 1 Liter',
                    'caption' => 'Cold brew 24 jam dalam botol 1 liter. Stock kopi untuk seminggu! 🍶 #coldbrew #kopibotol #kepri',
                    'price' => 75000,
                ],
            ],
            'Kerajinan Perak Dewi' => [
                [
                    'product_name' => 'Cincin Perak Ukir',
                    'caption' => 'Cincin perak 925 dengan ukiran tradisional Melayu Kepri. Handmade, bisa custom nama! 💍 #cincinperak #handmade #kerajinankepri',
                    'price' => 150000,
                ],
                [
                    'product_name' => 'Gelang Perak Melayu',
                    'caption' => 'Gelang perak motif Melayu dengan detail ukiran halus. Cocok untuk pria dan wanita 📿 #gelangperak #tanjungpinang',
                    'price' => 275000,
                ],
                [
                    'product_name' => 'Kalung Liontin',
                    'caption' => 'Kalung perak dengan liontin custom motif Kepri. Bisa request bentuk dan ukuran! ✨ #kalungperak #custom #kepri',
                    'price' => 200000,
                ],
                [
                    'product_name' => 'Anting Mutiara',
                    'caption' => 'Anting perak dengan mutiara laut Bintan asli. Elegan untuk acara formal 👂 #antingperak #mutiara #bintan',
                    'price' => 185000,
                ],
            ],
            'Sate Klathak Pak Hendra' => [
                [
                    'product_name' => 'Sate Klathak Kambing',
                    'caption' => 'Sate klathak kambing muda 10 tusuk. Empuk, bumbu meresap, dibakar arang kelapa! Hadir di Tanjungpinang! 🍢 #sateklathak #tanjungpinang #kulinerkepri',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Tongseng Kambing',
                    'caption' => 'Tongseng kambing dengan kuah santan kental dan kol. Hangat dan nikmat! 🍲 #tongseng #kulinertanjungpinang',
                    'price' => 35000,
                ],
                [
                    'product_name' => 'Gulai Kambing',
                    'caption' => 'Gulai kambing khas Kepri dengan rempah pilihan. Cocok dengan nasi hangat! 🥘 #gulaikambing #kepri',
                    'price' => 40000,
                ],
                [
                    'product_name' => 'Paket Keluarga',
                    'caption' => 'Paket keluarga: 30 tusuk sate + 2 tongseng + nasi 4 porsi. Hemat untuk makan bersama! 👨‍👩‍👧‍👦 #paketkeluarga #tanjungpinang',
                    'price' => 175000,
                ],
            ],
            'Jamu Bu Ratna' => [
                [
                    'product_name' => 'Beras Kencur',
                    'caption' => 'Jamu beras kencur segar untuk stamina dan nafsu makan. Racikan tradisional khas Tanjungpinang! 🌿 #beraskencur #jamu #tanjungpinang',
                    'price' => 8000,
                ],
                [
                    'product_name' => 'Kunyit Asam',
                    'caption' => 'Kunyit asam untuk melancarkan haid dan menjaga kesehatan kulit. Segar dan menyehatkan! 💛 #kunyitasam #kepri',
                    'price' => 8000,
                ],
                [
                    'product_name' => 'Temulawak',
                    'caption' => 'Jamu temulawak untuk kesehatan liver dan pencernaan. Pahit tapi berkhasiat! 🍃 #temulawak #sehat #jamukepri',
                    'price' => 10000,
                ],
                [
                    'product_name' => 'Paket Jamu Sehat',
                    'caption' => 'Paket 5 botol jamu campur untuk seminggu. Jaga kesehatan keluarga di Kepri! 🏠 #paketjamu #sehatkeluarga #tanjungpinang',
                    'price' => 35000,
                ],
            ],
            'Elektronik Mas Agus' => [
                [
                    'product_name' => 'Service HP',
                    'caption' => 'Service HP segala merk di Tanjungpinang. Ganti LCD, baterai, charging port. Garansi 1 bulan! 📱 #servicehp #teknisi #tanjungpinang',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Ganti LCD iPhone',
                    'caption' => 'Ganti LCD iPhone original dan KW super. Proses cepat, hasil rapi! Terpercaya di Kepri! 🍎 #lcdiphone #sparepartiphone #kepri',
                    'price' => 350000,
                ],
                [
                    'product_name' => 'Service Laptop',
                    'caption' => 'Service laptop: install ulang, ganti keyboard, upgrade RAM/SSD. Semua merk! 💻 #servicelaptop #tanjungpinang',
                    'price' => 100000,
                ],
                [
                    'product_name' => 'Aksesoris HP',
                    'caption' => 'Jual aksesoris HP: case, tempered glass, charger, earphone. Harga grosir! 🎧 #aksesoriship #kepri',
                    'price' => 25000,
                ],
            ],
            'Kue Tradisional Bu Wati' => [
                [
                    'product_name' => 'Klepon',
                    'caption' => 'Klepon isi gula merah dengan taburan kelapa parut. Mledos di mulut! Kue tradisional favorit Tanjungpinang! 🟢 #klepon #jajanpasar #tanjungpinang',
                    'price' => 15000,
                ],
                [
                    'product_name' => 'Onde-onde',
                    'caption' => 'Onde-onde wijen isi kacang hijau. Renyah di luar, lembut di dalam! 🟡 #ondeonde #kuetradisional #kepri',
                    'price' => 18000,
                ],
                [
                    'product_name' => 'Getuk Lindri',
                    'caption' => 'Getuk lindri warna-warni dari singkong pilihan. Manis legit! 🌈 #getuklindri #kuemelayu #tanjungpinang',
                    'price' => 12000,
                ],
                [
                    'product_name' => 'Paket Jajan Pasar',
                    'caption' => 'Paket jajan pasar isi 20 pcs campur. Cocok untuk arisan dan pengajian di Kepri! 📦 #jajanpasar #snackbox #kepri',
                    'price' => 50000,
                ],
                [
                    'product_name' => 'Lupis',
                    'caption' => 'Lupis ketan dengan siraman gula merah dan kelapa parut. Kenyal dan manis! 🍡 #lupis #kuetradisional #tanjungpinang',
                    'price' => 10000,
                ],
            ],
            'Furniture Jati Pak Darmawan' => [
                [
                    'product_name' => 'Meja Makan Jati',
                    'caption' => 'Meja makan jati 6 kursi. Kayu jati TPK grade A, finishing natural. Awet puluhan tahun! Produksi Bintan! 🪑 #mejamakan #furniturjati #bintan',
                    'price' => 8500000,
                ],
                [
                    'product_name' => 'Lemari Pakaian',
                    'caption' => 'Lemari pakaian 3 pintu kayu jati. Desain klasik dengan ukiran Melayu 🚪 #lemarijati #furnitur #bintan',
                    'price' => 12000000,
                ],
                [
                    'product_name' => 'Tempat Tidur Minimalis',
                    'caption' => 'Tempat tidur minimalis kayu jati ukuran queen. Simple tapi elegan! Kualitas Bintan! 🛏️ #tempattidur #minimalis #bintan',
                    'price' => 6500000,
                ],
                [
                    'product_name' => 'Kursi Tamu Set',
                    'caption' => 'Set kursi tamu 3-2-1 dengan meja. Cocok untuk ruang tamu modern! Furniture Bintan berkualitas! 🛋️ #kursitamu #livingroom #bintan',
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
