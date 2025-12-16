import { Button } from '@/components/ui/button';
import { ReelsGrid } from '@/components/landing/reels-grid';
import { Head } from '@inertiajs/react';
import { MapPin, MessageCircle, Clock, Share2, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock Data
const umkm = {
    id: 1,
    name: 'Warung Gudeg Bu Tini',
    description: 'Menyediakan gudeg asli Jogja dengan resep turun temurun sejak 1980. Spesial Gudeg Yu Djum style dengan krecek pedas dan areh gurih.',
    address: 'Jl. Malioboro No. 123, Yogyakarta',
    whatsapp: '6281234567890',
    lat: -7.7956,
    lng: 110.3695,
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    rating: 4.8,
    reviews: 124,
    isOpen: true,
};

export default function ShowUMKM() {
    const whatsappLink = `https://wa.me/${umkm.whatsapp}?text=Halo ${umkm.name}, saya melihat profil Anda di PKM Hyperlocal.`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900">
            <Head title={`${umkm.name} - PKM Hyperlocal`} />

            {/* Cover Image */}
            <div className="relative h-48 w-full bg-gray-200 md:h-64">
                <img
                    src={umkm.cover}
                    alt="Cover"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4">
                <div className="relative -mt-16 mb-8 flex flex-col items-center gap-4 text-center md:mb-6 md:flex-row md:items-end md:gap-6 md:text-left">
                    {/* Avatar */}
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-40 md:w-40 dark:border-gray-900">
                        <img
                            src={umkm.avatar}
                            alt={umkm.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Info Text */}
                    <div className="flex-1 pb-2">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {umkm.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 md:justify-start dark:text-gray-300">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 shrink-0" /> {umkm.address}
                            </span>
                            <span className="hidden text-gray-400 md:inline">•</span>
                            <span className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current shrink-0" /> {umkm.rating} ({umkm.reviews} ulasan)
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2 pb-2 md:pb-4">
                        <Button
                            asChild
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Chat WhatsApp
                            </a>
                        </Button>
                        <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
                    {/* Main Content (Reels) */}
                    <div className="md:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                Galeri Video
                            </h2>
                            {/* Reuse existing reels grid (with sample data for now) */}
                            <ReelsGrid umkmId={umkm.id} />
                        </div>
                    </div>

                    {/* Sidebar (Info & Map) */}
                    <div className="space-y-6">
                        {/* Description */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Tentang Kami
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {umkm.description}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Buka Sekarang</span>
                                <span className="text-gray-500 dark:text-gray-400">• 08:00 - 21:00</span>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
                            <div className="h-48 w-full bg-gray-100">
                                <MapContainer
                                    center={[umkm.lat, umkm.lng]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    className="h-full w-full"
                                    dragging={false}
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[umkm.lat, umkm.lng]} />
                                </MapContainer>
                            </div>
                            <div className="p-3">
                                <Button variant="outline" className="w-full text-xs" asChild>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${umkm.lat},${umkm.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MapPin className="mr-2 h-3.5 w-3.5" />
                                        Buka di Google Maps
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
