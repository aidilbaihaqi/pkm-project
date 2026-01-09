import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Play, Heart, MapPin, Store, Search, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';

// API Reel type matching backend response
interface ApiReel {
    id: number;
    video_url: string | null;
    thumbnail_url: string | null;
    product_name: string;
    caption: string | null;
    price: string | null;
    kategori: string;
    type: 'video' | 'image';
    status: string;
    whatsapp_link: string;
    distance_km: number;
    created_at: string;
    umkm_profile: {
        id: number;
        nama_toko: string;
        kategori: string;
        avatar: string | null;
        is_open: boolean;
    };
}

// Internal type for display
interface ExploreItem {
    id: number;
    thumbnail: string;
    likes: string;
    umkmName: string;
    umkmId: number;
    category: string;
    location: string;
    distance: string;
}

// Transform API response to internal type
function transformApiReel(apiReel: ApiReel): ExploreItem {
    return {
        id: apiReel.id,
        thumbnail: apiReel.thumbnail_url || `https://picsum.photos/seed/umkm${apiReel.id}/400/600`,
        likes: '0',
        umkmName: apiReel.umkm_profile.nama_toko,
        umkmId: apiReel.umkm_profile.id,
        category: apiReel.kategori,
        location: 'Indonesia',
        distance: apiReel.distance_km ? `${apiReel.distance_km}km` : '',
    };
}

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
    const [exploreItems, setExploreItems] = useState<ExploreItem[]>([]);
    const [nearbyUMKM, setNearbyUMKM] = useState<ExploreItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Default location (Yogyakarta)
    const [userLocation] = useState({ lat: -7.7956, lng: 110.3695 });

    // Fetch reels from API
    const fetchReels = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                ReelsController.index.url({
                    query: {
                        lat: userLocation.lat.toString(),
                        lng: userLocation.lng.toString(),
                        radius: '50',
                        per_page: '20'
                    }
                })
            );

            if (!response.ok) {
                throw new Error('Failed to fetch reels');
            }

            const data = await response.json();
            const items = (data.data || []).map(transformApiReel);
            
            setExploreItems(items);
            // Sort by distance for nearby section
            const sorted = [...items].sort((a, b) => {
                const distA = parseFloat(a.distance) || 999;
                const distB = parseFloat(b.distance) || 999;
                return distA - distB;
            });
            setNearbyUMKM(sorted.slice(0, 6));
        } catch (err) {
            console.error('Error fetching reels:', err);
            setError('Gagal memuat konten. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [userLocation]);

    useEffect(() => {
        fetchReels();
    }, [fetchReels]);

    const filteredItems = activeTab === "Semua"
        ? exploreItems
        : exploreItems.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

    return (
        <AppLayout>
            <Head title="Jelajahi UMKM - UMKMku" />

            <div className="w-full pb-24 md:pb-8">
                {/* Search Bar - Sticky on Mobile */}
                <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-3 py-3 md:hidden border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari UMKM atau produk..."
                            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-umkm-orange focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:border-umkm-orange"
                        />
                    </div>
                </div>

                <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="hidden sm:block mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Jelajahi <span className="text-umkm-orange">UMKM</span>
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Temukan produk lokal terbaik dari seluruh Indonesia
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 text-umkm-orange animate-spin" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat konten...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                            <button
                                onClick={fetchReels}
                                className="px-4 py-2 bg-umkm-orange text-white rounded-lg hover:bg-umkm-orange-dark"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {/* UMKM Terdekat Section */}
                            {nearbyUMKM.length > 0 && (
                                <div className="mb-4 md:mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-umkm-green" />
                                            <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                                UMKM Terdekat
                                            </h2>
                                        </div>
                                        <Link href="/nearby" className="flex items-center gap-1 text-xs md:text-sm font-semibold text-umkm-orange hover:text-umkm-orange-dark">
                                            Lihat Semua
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                    
                                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-3">
                                        {nearbyUMKM.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/umkm/${item.umkmId}`}
                                                className="group relative flex-shrink-0 w-28 sm:w-32 md:w-auto aspect-square overflow-hidden rounded-xl bg-gray-900 cursor-pointer shadow-md hover:shadow-xl transition-all active:scale-95 md:hover:scale-105"
                                            >
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.umkmName}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-90"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                                                {item.distance && (
                                                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
                                                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-umkm-green text-white text-[9px] md:text-[10px] font-bold">
                                                            <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                            {item.distance}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 w-full p-1.5 md:p-2 text-white">
                                                    <h3 className="font-bold text-[10px] md:text-xs mb-0.5 drop-shadow-md line-clamp-1">
                                                        {item.umkmName}
                                                    </h3>
                                                    <p className="text-[9px] md:text-[10px] opacity-80 line-clamp-1">{item.category}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category Filter Bar */}
                            <div className="sticky top-[57px] md:top-0 z-20 bg-white dark:bg-gray-900 -mx-3 px-3 sm:mx-0 sm:px-0 py-2 md:py-0 md:mb-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setActiveTab(cat.name)}
                                            className={cn(
                                                "whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95",
                                                activeTab === cat.name
                                                    ? "bg-umkm-orange text-white shadow-lg shadow-umkm-orange/20"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            <span className="text-sm sm:text-base">{cat.icon}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span> UMKM
                                </p>
                            </div>

                            {/* Grid Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                {filteredItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/umkm/${item.umkmId}`}
                                        className="group relative aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl bg-gray-900 cursor-pointer shadow-md hover:shadow-xl transition-shadow active:scale-[0.98]"
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.umkmName}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
                                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-umkm-orange/90 text-white text-[9px] sm:text-[10px] font-semibold backdrop-blur-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                                <Play className="h-6 w-6 fill-white text-white ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 sm:p-3 text-white">
                                            <h3 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 drop-shadow-md line-clamp-1">
                                                {item.umkmName}
                                            </h3>
                                            <div className="flex items-center justify-between text-[10px] sm:text-xs opacity-90">
                                                <div className="flex items-center gap-0.5 sm:gap-1 min-w-0 flex-1">
                                                    <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                    <span className="truncate">{item.distance || item.location}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ml-2">
                                                    <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                    <span>{item.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                                    <Store className="h-12 w-12 md:h-16 md:w-16 text-gray-300 dark:text-gray-600 mb-3 md:mb-4" />
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">
                                        Belum ada UMKM
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Tidak ada UMKM untuk kategori "{activeTab}"
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
