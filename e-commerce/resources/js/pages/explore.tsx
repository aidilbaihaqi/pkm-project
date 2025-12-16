import { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Play, Heart, MapPin, Store, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for Explore Grid - UMKM focused
const exploreItems = [
    { id: 1, thumbnail: 'https://picsum.photos/seed/umkm1/400/600', likes: '2.5K', umkmName: 'Warung Bu Tini', category: 'Kuliner', location: 'Yogyakarta' },
    { id: 2, thumbnail: 'https://picsum.photos/seed/umkm2/400/600', likes: '1.8K', umkmName: 'Batik Pekalongan', category: 'Fashion', location: 'Pekalongan' },
    { id: 3, thumbnail: 'https://picsum.photos/seed/umkm3/400/600', likes: '3.2K', umkmName: 'Kopi Nusantara', category: 'Kuliner', location: 'Bandung' },
    { id: 4, thumbnail: 'https://picsum.photos/seed/umkm4/400/600', likes: '980', umkmName: 'Kerajinan Bali', category: 'Kerajinan', location: 'Bali' },
    { id: 5, thumbnail: 'https://picsum.photos/seed/umkm5/400/600', likes: '4.1K', umkmName: 'Sate Madura Pak Jo', category: 'Kuliner', location: 'Surabaya' },
    { id: 6, thumbnail: 'https://picsum.photos/seed/umkm6/400/600', likes: '1.2K', umkmName: 'Tenun Flores', category: 'Fashion', location: 'NTT' },
    { id: 7, thumbnail: 'https://picsum.photos/seed/umkm7/400/600', likes: '2.1K', umkmName: 'Rendang Minang', category: 'Kuliner', location: 'Padang' },
    { id: 8, thumbnail: 'https://picsum.photos/seed/umkm8/400/600', likes: '890', umkmName: 'Furniture Jepara', category: 'Kerajinan', location: 'Jepara' },
    { id: 9, thumbnail: 'https://picsum.photos/seed/umkm9/400/600', likes: '1.5K', umkmName: 'Tempe Malang', category: 'Kuliner', location: 'Malang' },
    { id: 10, thumbnail: 'https://picsum.photos/seed/umkm10/400/600', likes: '760', umkmName: 'Songket Palembang', category: 'Fashion', location: 'Palembang' },
    { id: 11, thumbnail: 'https://picsum.photos/seed/umkm11/400/600', likes: '2.8K', umkmName: 'Gudeg Wijilan', category: 'Kuliner', location: 'Yogyakarta' },
    { id: 12, thumbnail: 'https://picsum.photos/seed/umkm12/400/600', likes: '1.1K', umkmName: 'Gerabah Kasongan', category: 'Kerajinan', location: 'Yogyakarta' },
];

// UMKM-focused categories
const categories = [
    { name: "Semua", icon: "🏪" },
    { name: "Kuliner", icon: "🍜" },
    { name: "Fashion", icon: "👗" },
    { name: "Kerajinan", icon: "🎨" },
    { name: "Jasa", icon: "🔧" },
    { name: "Pertanian", icon: "🌾" },
    { name: "Minuman", icon: "🧋" },
    { name: "Kecantikan", icon: "💄" },
    { name: "Elektronik", icon: "📱" },
];

export default function Explore() {
    const [activeTab, setActiveTab] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = activeTab === "Semua"
        ? exploreItems
        : exploreItems.filter(item => item.category === activeTab);

    return (
        <AppLayout>
            <Head title="Jelajahi UMKM - UMKMku" />

            <div className="w-full max-w-7xl mx-auto px-4 py-6">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Jelajahi <span className="text-umkm-orange">UMKM</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Temukan produk lokal terbaik dari seluruh Indonesia
                    </p>
                </div>

                {/* Search Bar - Mobile */}
                <div className="relative mb-4 md:hidden">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari UMKM atau produk..."
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-umkm-orange focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:border-umkm-orange"
                    />
                </div>

                {/* Category Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveTab(cat.name)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                                activeTab === cat.name
                                    ? "bg-umkm-orange text-white shadow-lg shadow-umkm-orange/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            )}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span> UMKM
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/umkm/${item.id}`}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-900 cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                        >
                            <img
                                src={item.thumbnail}
                                alt={item.umkmName}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

                            {/* Category Badge */}
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 rounded-full bg-umkm-orange/90 text-white text-[10px] font-semibold backdrop-blur-sm">
                                    {item.category}
                                </span>
                            </div>

                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="h-6 w-6 fill-white text-white ml-1" />
                                </div>
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                                {/* UMKM Name */}
                                <h3 className="font-bold text-sm mb-1 drop-shadow-md line-clamp-1">
                                    {item.umkmName}
                                </h3>

                                {/* Location & Likes */}
                                <div className="flex items-center justify-between text-xs opacity-90">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{item.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        <span>{item.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Belum ada UMKM
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada UMKM untuk kategori "{activeTab}"
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
