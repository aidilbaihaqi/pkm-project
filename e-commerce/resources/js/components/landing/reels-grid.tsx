import { MapPin, Play, Heart, Share2, Eye } from 'lucide-react';
import { TikTokPlayer } from './tiktok-player';
import { useState } from 'react';

// ... imports

// Sample data untuk demo - nanti diganti dengan data dari API
const sampleReels = [
    {
        id: 1,
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
        umkmName: 'Warung Gudeg Bu Tini', // Match mock UMKM
        umkmId: 1,
        product: 'Nasi Gudeg Spesial',
        distance: '500m',
        whatsapp: '6281234567890',
        views: 1250,
        likes: 234,
        comments: 42,
    },
    {
        id: 2,
        thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
        umkmName: 'Kedai Kopi Pak Joko',
        umkmId: 2,
        product: 'Kopi Susu Gula Aren',
        distance: '800m',
        whatsapp: '6281234567891',
        views: 856,
        likes: 189,
        comments: 28,
    },
    {
        id: 3,
        thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop',
        umkmName: 'Bakso Mas Budi',
        umkmId: 3,
        product: 'Bakso Urat Jumbo',
        distance: '1.2km',
        whatsapp: '6281234567892',
        views: 2100,
        likes: 445,
        comments: 67,
    },
    {
        id: 4,
        thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop',
        umkmName: 'Martabak Manis Sari',
        umkmId: 4,
        product: 'Martabak Coklat Keju',
        distance: '1.5km',
        whatsapp: '6281234567893',
        views: 3400,
        likes: 678,
        comments: 89,
    },
    {
        id: 5,
        thumbnail: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=600&fit=crop', // Food
        umkmName: 'Warung Gudeg Bu Tini',
        umkmId: 1,
        product: 'Krecek Pedas',
        distance: '500m',
        whatsapp: '6281234567890',
        views: 950,
        likes: 150,
        comments: 30,
    },
    {
        id: 6,
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
        umkmName: 'Es Cendol Ibu Ani',
        umkmId: 6,
        product: 'Es Cendol Durian',
        distance: '2.3km',
        whatsapp: '6281234567895',
        views: 945,
        likes: 156,
        comments: 23,
    },
    // ... more items
];

// ... sampleReels data

// Format number to K format (1000 -> 1K)
function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

// Generate WhatsApp link with auto message
function getWhatsAppLink(phone: string, product: string, umkm: string) {
    const message = encodeURIComponent(
        `Halo ${umkm}! Saya tertarik dengan ${product}. Apakah masih tersedia?`
    );
    return `https://wa.me/${phone}?text=${message}`;
}

interface ReelsGridProps {
    umkmId?: number;
}

export function ReelsGrid({ umkmId }: ReelsGridProps) {
    const [selectedReelId, setSelectedReelId] = useState<number | null>(null);

    // Filter reels if umkmId is provided
    const displayReels = umkmId
        ? sampleReels.filter(reel => reel.umkmId === umkmId || reel.umkmName === 'Warung Gudeg Bu Tini')
        : sampleReels;

    const handleReelClick = (id: number) => {
        setSelectedReelId(id);
    };

    const closePlayer = () => {
        setSelectedReelId(null);
    };

    return (
        <>
            {selectedReelId !== null && (
                <TikTokPlayer
                    reels={displayReels}
                    initialIndex={displayReels.findIndex(r => r.id === selectedReelId)}
                    onClose={closePlayer}
                />
            )}

            <section className={umkmId ? "bg-white dark:bg-gray-800" : "min-h-screen bg-gray-50 py-3 sm:py-4 dark:bg-gray-900"}>
                <div className={umkmId ? "" : "container mx-auto px-2 sm:px-4"}>
                    {/* Reels Grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {displayReels.map((reel) => (
                            <div
                                key={reel.id}
                                onClick={() => handleReelClick(reel.id)}
                                className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-lg bg-gray-200 shadow-sm transition-all hover:shadow-lg sm:rounded-xl dark:bg-gray-800"
                            >
                                {/* ... Content same as before ... */}
                                <img
                                    src={reel.thumbnail}
                                    alt={reel.product}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* ... Overlay & Buttons ... */}
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Play button - shown on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm sm:h-14 sm:w-14">
                                        <Play className="h-5 w-5 fill-white text-white sm:h-6 sm:w-6" />
                                    </div>
                                </div>

                                {/* Top badges */}
                                <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-1.5 sm:p-2">
                                    {/* Distance - Hide if on Profile page (redundant) */}
                                    {!umkmId && (
                                        <div className="flex items-center gap-1 rounded-full bg-teal-600 px-1.5 py-0.5 sm:px-2 sm:py-1">
                                            <MapPin className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                                            <span className="text-[10px] font-medium text-white sm:text-xs">{reel.distance}</span>
                                        </div>
                                    )}
                                    {umkmId && <div></div>} {/* Spacer if distance hidden */}

                                    {/* Views badge */}
                                    <div className="flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm sm:px-2 sm:py-1">
                                        <Eye className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                                        <span className="text-[10px] font-medium text-white sm:text-xs">{formatNumber(reel.views)}</span>
                                    </div>
                                </div>

                                {/* Right side action buttons */}
                                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 flex-col gap-2 sm:right-2 sm:gap-3">
                                    {/* Like Button */}
                                    <button className="group/btn flex flex-col items-center gap-0.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-red-500 sm:h-10 sm:w-10">
                                            <Heart className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                        </div>
                                        <span className="text-[10px] font-medium text-white sm:text-xs">{formatNumber(reel.likes)}</span>
                                    </button>

                                    {/* Share Button */}
                                    <button className="group/btn flex flex-col items-center gap-0.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-teal-500 sm:h-10 sm:w-10">
                                            <Share2 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                        </div>
                                        <span className="text-[10px] font-medium text-white sm:text-xs">Share</span>
                                    </button>
                                </div>

                                {/* Content info */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                                    <h3 className="line-clamp-1 text-xs font-semibold text-white sm:text-sm">
                                        {reel.product}
                                    </h3>
                                    {/* Hide UMKM Name on Profile Page (redundant) */}
                                    {!umkmId && (
                                        <p className="line-clamp-1 text-[10px] text-gray-300 sm:text-xs">
                                            {reel.umkmName}
                                        </p>
                                    )}

                                    {/* WhatsApp CTA Button */}
                                    <a
                                        href={getWhatsAppLink(reel.whatsapp, reel.product, reel.umkmName)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-green-500 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-green-600 sm:gap-1.5 sm:py-2 sm:text-xs"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <span>Pesan via WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
