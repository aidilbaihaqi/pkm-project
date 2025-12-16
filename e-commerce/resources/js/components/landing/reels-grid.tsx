import { MapPin, Play, MessageSquare } from 'lucide-react';

// Sample data untuk demo - nanti diganti dengan data dari API
const sampleReels = [
    {
        id: 1,
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
        umkmName: 'Warung Makan Bu Tini',
        product: 'Nasi Gudeg Spesial',
        distance: '500m',
        whatsapp: '6281234567890',
    },
    {
        id: 2,
        thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
        umkmName: 'Kedai Kopi Pak Joko',
        product: 'Kopi Susu Gula Aren',
        distance: '800m',
        whatsapp: '6281234567891',
    },
    {
        id: 3,
        thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop',
        umkmName: 'Bakso Mas Budi',
        product: 'Bakso Urat Jumbo',
        distance: '1.2km',
        whatsapp: '6281234567892',
    },
    {
        id: 4,
        thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop',
        umkmName: 'Martabak Manis Sari',
        product: 'Martabak Coklat Keju',
        distance: '1.5km',
        whatsapp: '6281234567893',
    },
    {
        id: 5,
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop',
        umkmName: 'Sate Ayam H. Rahman',
        product: 'Sate Ayam Madura',
        distance: '2km',
        whatsapp: '6281234567894',
    },
    {
        id: 6,
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
        umkmName: 'Es Cendol Ibu Ani',
        product: 'Es Cendol Durian',
        distance: '2.3km',
        whatsapp: '6281234567895',
    },
    {
        id: 7,
        thumbnail: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=600&fit=crop',
        umkmName: 'Ayam Geprek Mbak Lia',
        product: 'Geprek Level 5',
        distance: '2.8km',
        whatsapp: '6281234567896',
    },
    {
        id: 8,
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop',
        umkmName: 'Salad Buah Sehat',
        product: 'Salad Bowl Premium',
        distance: '3km',
        whatsapp: '6281234567897',
    },
];

// Generate WhatsApp link with auto message
function getWhatsAppLink(phone: string, product: string, umkm: string) {
    const message = encodeURIComponent(
        `Halo ${umkm}! Saya tertarik dengan ${product}. Apakah masih tersedia?`
    );
    return `https://wa.me/${phone}?text=${message}`;
}

export function ReelsGrid() {
    return (
        <section className="min-h-screen bg-gray-50 py-3 sm:py-4 dark:bg-gray-900">
            <div className="container mx-auto px-2 sm:px-4">
                {/* Section Header */}
                <div className="mb-4 px-1 sm:mb-6 sm:px-0">
                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
                        🔥 UMKM Terdekat
                    </h2>
                    <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                        Temukan produk UMKM di sekitarmu
                    </p>
                </div>

                {/* Reels Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {sampleReels.map((reel) => (
                        <div
                            key={reel.id}
                            className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-lg bg-gray-200 shadow-sm transition-all hover:shadow-lg sm:rounded-xl dark:bg-gray-800"
                        >
                            {/* Thumbnail */}
                            <img
                                src={reel.thumbnail}
                                alt={reel.product}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            {/* Play button - shown on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm sm:h-14 sm:w-14">
                                    <Play className="h-5 w-5 fill-white text-white sm:h-6 sm:w-6" />
                                </div>
                            </div>

                            {/* Distance badge */}
                            <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-teal-600 px-1.5 py-0.5 sm:left-2 sm:top-2 sm:px-2 sm:py-1">
                                <MapPin className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                                <span className="text-[10px] font-medium text-white sm:text-xs">{reel.distance}</span>
                            </div>

                            {/* Content info */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                                <h3 className="line-clamp-1 text-xs font-semibold text-white sm:text-sm">
                                    {reel.product}
                                </h3>
                                <p className="line-clamp-1 text-[10px] text-gray-300 sm:text-xs">
                                    {reel.umkmName}
                                </p>

                                {/* WhatsApp CTA Button - sesuai README */}
                                <a
                                    href={getWhatsAppLink(reel.whatsapp, reel.product, reel.umkmName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-green-500 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-green-600 sm:gap-1.5 sm:py-2 sm:text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>Pesan via WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-6 flex justify-center sm:mt-8">
                    <button className="w-full max-w-xs rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 sm:w-auto sm:px-8 sm:py-3">
                        Muat Lebih Banyak
                    </button>
                </div>
            </div>
        </section>
    );
}
