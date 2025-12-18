import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { MapPin, MessageCircle, Clock, Share2, Play, Heart, Grid3X3, Lock, ExternalLink, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';

// Mock Data
const umkm = {
    id: 1,
    name: 'Warung Gudeg Bu Tini',
    username: 'gudeg_butini',
    description: 'Menyediakan gudeg asli Jogja dengan resep turun temurun sejak 1980. Spesial Gudeg Yu Djum style dengan krecek pedas dan areh gurih.',
    address: 'Jl. Malioboro No. 123, Yogyakarta',
    whatsapp: '6281234567890',
    lat: -7.7956,
    lng: 110.3695,
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    isOpen: true,
    openHours: '08:00 - 21:00',
    totalVideos: 24,
    totalLikes: 12500,
    likedVideosPublic: true,
};

// Mock Videos/Photos
const mockVideos = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop', views: 26000, type: 'video' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop', views: 4500000, type: 'video' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop', views: 7900000, type: 'video' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop', views: 775800, type: 'image' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop', views: 37300, type: 'video' },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=600&fit=crop', views: 3000000, type: 'video' },
];

const mockLikedVideos = [
    { id: 7, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop', views: 15000, type: 'video' },
    { id: 8, thumbnail: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=600&fit=crop', views: 8200, type: 'video' },
];

// Format view count
function formatViews(views: number): string {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

export default function ShowUMKM() {
    const [activeTab, setActiveTab] = useState<'video' | 'liked'>('video');
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

    const whatsappLink = `https://wa.me/${umkm.whatsapp}?text=Halo ${umkm.name}, saya melihat profil Anda di UMKMku.`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${umkm.lat},${umkm.lng}`;
    const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://umkmku.com/umkm/${umkm.id}`;

    const currentVideos = activeTab === 'video' ? mockVideos : mockLikedVideos;

    // Share handler with Web Share API fallback to clipboard
    const handleShare = async () => {
        const shareData = {
            title: umkm.name,
            text: `Lihat profil ${umkm.name} di UMKMku!`,
            url: profileUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(profileUrl);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            }
        } catch (err) {
            // User cancelled or error - try clipboard
            try {
                await navigator.clipboard.writeText(profileUrl);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            } catch {
                console.error('Failed to share');
            }
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-white pb-20 dark:bg-gray-950">
                <Head title={`${umkm.name} - UMKMku`} />

                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-950 pt-4 pb-4 px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Top Row: Avatar & Info */}
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-teal-500 p-0.5">
                                <img
                                    src={umkm.avatar}
                                    alt={umkm.name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {umkm.name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{umkm.username}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                    <div className="text-center">
                                        <span className="font-bold text-gray-900 dark:text-white">{umkm.totalVideos}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Video</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-gray-900 dark:text-white">{formatViews(umkm.totalLikes)}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Suka</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {umkm.description}
                        </p>

                        {/* Location & Hours */}
                        <div className="mt-3 space-y-1.5">
                            <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate">{umkm.address}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                            </a>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
                                <span className={cn(
                                    "font-medium",
                                    umkm.isOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                    {umkm.isOpen ? 'Buka' : 'Tutup'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">• {umkm.openHours}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <Button
                                asChild
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    WhatsApp
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                                onClick={handleShare}
                            >
                                {shareStatus === 'copied' ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Share2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-2xl mx-auto flex">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === 'video'
                                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            <Grid3X3 className="h-5 w-5" />
                            <span className="hidden sm:inline">Video</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === 'liked'
                                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            <Heart className="h-5 w-5" />
                            <span className="hidden sm:inline">Disukai</span>
                            {!umkm.likedVideosPublic && <Lock className="h-3 w-3" />}
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-2xl mx-auto">
                    {activeTab === 'liked' && !umkm.likedVideosPublic ? (
                        // Private Liked Videos Message
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <Lock className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Video yang disukai bersifat privat
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Hanya pemilik yang dapat melihat video yang disukai
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                            {currentVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/`}
                                    className="relative aspect-[9/12] bg-gray-100 dark:bg-gray-800 overflow-hidden group"
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt=""
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    {/* Play Icon for Videos */}
                                    {video.type === 'video' && (
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-medium drop-shadow-lg">
                                            <Play className="h-3 w-3 fill-white" />
                                            <span>{formatViews(video.views)}</span>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {currentVideos.length === 0 && activeTab === 'video' && (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <Grid3X3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Belum ada video
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Video yang diupload akan muncul di sini
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
