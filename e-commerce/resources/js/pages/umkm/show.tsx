import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, MessageCircle, Clock, Share2, Play, Heart, Grid3X3, Lock, ExternalLink, Check, Loader2, X, ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import UmkmController from '@/actions/App/Http/Controllers/Umkm/UmkmController';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';

interface Umkm {
    id: number;
    name: string;
    description: string;
    address: string;
    whatsapp: string;
    lat: number;
    lng: number;
    avatar: string | null;
    is_open: boolean;
    open_hours: string;
    category: string;
}

interface Reel {
    id: number;
    product_name: string;
    thumbnail_url: string | null;
    video_url: string | null;
    views_count: number;
    likes_count?: number;
    images: string[] | null;
    type: 'video' | 'image';
    caption: string | null;
}

function formatViews(views: number): string {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

export default function ShowUMKM() {
    const { props } = usePage<{ id: string }>();
    const umkmId = props.id;

    const [umkm, setUmkm] = useState<Umkm | null>(null);
    const [reels, setReels] = useState<Reel[]>([]);
    const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'video' | 'liked'>('video');
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

    const fetchUmkmData = useCallback(async () => {
        if (!umkmId) return;

        try {
            setIsLoading(true);
            setError(null);

            // Fetch UMKM profile using direct API URL
            const apiUrl = `/api/umkm/${umkmId}`;
            console.log('Fetching UMKM from:', apiUrl);

            const umkmResponse = await fetch(apiUrl, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            // Get response as text first to handle HTML error pages
            const umkmText = await umkmResponse.text();
            console.log('UMKM response preview:', umkmText.substring(0, 100));

            // Check if response starts with HTML (server error page)
            if (umkmText.trim().startsWith('<')) {
                throw new Error('UMKM tidak ditemukan');
            }

            if (!umkmResponse.ok) {
                throw new Error('UMKM tidak ditemukan');
            }

            const umkmData = JSON.parse(umkmText);

            // Map API response to component interface
            setUmkm({
                id: umkmData.data.id,
                name: umkmData.data.nama_toko,
                description: umkmData.data.deskripsi || '',
                address: umkmData.data.alamat || '',
                whatsapp: umkmData.data.nomor_wa || '',
                lat: umkmData.data.latitude,
                lng: umkmData.data.longitude,
                avatar: umkmData.data.avatar,
                is_open: umkmData.data.is_open,
                open_hours: umkmData.data.open_hours || '09:00 - 21:00',
                category: umkmData.data.kategori,
            });

            // Fetch reels for this UMKM using direct API URL
            try {
                const reelsResponse = await fetch(`/api/reels?umkm_id=${umkmId}`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (reelsResponse.ok) {
                    const reelsText = await reelsResponse.text();
                    if (!reelsText.trim().startsWith('<')) {
                        const reelsData = JSON.parse(reelsText);
                        setReels(reelsData.data || []);
                    }
                }
            } catch (reelErr) {
                console.error('Error fetching reels:', reelErr);
            }

        } catch (err) {
            console.error('Error fetching UMKM data:', err);
            setError(err instanceof Error ? err.message : 'Gagal memuat data UMKM');
        } finally {
            setIsLoading(false);
        }
    }, [umkmId]);

    useEffect(() => {
        fetchUmkmData();
    }, [fetchUmkmData]);

    const whatsappLink = umkm ? `https://wa.me/${umkm.whatsapp}?text=Halo ${umkm.name}, saya melihat profil Anda di UMKMku.` : '';
    const mapsLink = umkm ? `https://www.google.com/maps/search/?api=1&query=${umkm.lat},${umkm.lng}` : '';
    const profileUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = async () => {
        if (!umkm) return;

        const shareData = {
            title: umkm.name,
            text: `Lihat profil ${umkm.name} di UMKMku!`,
            url: profileUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(profileUrl);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            }
        } catch {
            try {
                await navigator.clipboard.writeText(profileUrl);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            } catch {
                console.error('Failed to share');
            }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <AppLayout>
                <Head title="Memuat..." />
                <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 text-umkm-orange animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400">Memuat profil UMKM...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Error state
    if (error || !umkm) {
        return (
            <AppLayout>
                <Head title="Error" />
                <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-center px-4">
                        <p className="text-gray-500 dark:text-gray-400">{error || 'UMKM tidak ditemukan'}</p>
                        <Button onClick={fetchUmkmData} className="bg-umkm-orange hover:bg-umkm-orange-dark">
                            Coba Lagi
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const totalViews = reels.reduce((sum, reel) => sum + (reel.views_count || 0), 0);

    return (
        <AppLayout>
            <div className="min-h-screen bg-white pb-20 dark:bg-gray-950">
                <Head title={`${umkm.name} - UMKMku`} />

                {/* Modal for Reel Playback */}
                {selectedReel && (
                    <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm">
                        <button
                            onClick={() => setSelectedReel(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="w-full h-full md:max-w-4xl md:h-[90vh] bg-black rounded-lg overflow-hidden relative shadow-2xl">
                            <ReelPlayer reel={selectedReel} />

                            {/* Info Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none">
                                <div className="pointer-events-auto">
                                    <h3 className="text-white font-bold text-lg">{selectedReel.product_name}</h3>
                                    <p className="text-white/90 text-sm mt-1 line-clamp-2">{selectedReel.caption}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-950 pt-4 pb-4 px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Top Row: Avatar & Info */}
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-teal-500 p-0.5">
                                <img
                                    src={umkm.avatar || '/images/default-avatar.png'}
                                    alt={umkm.name}
                                    className="h-full w-full rounded-full object-cover bg-gray-100"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                    {umkm.name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {umkm.category}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                    <div className="text-center">
                                        <span className="font-bold text-gray-900 dark:text-white">{reels.length}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Video</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-gray-900 dark:text-white">{formatViews(totalViews)}</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Views</span>
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
                                    umkm.is_open ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                    {umkm.is_open ? 'Buka' : 'Tutup'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">• {umkm.open_hours}</span>
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
                            <Lock className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-2xl mx-auto">
                    {activeTab === 'liked' ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <Lock className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Video yang disukai bersifat privat
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Hanya pemilik yang dapat melihat video yang disukai
                            </p>
                        </div>
                    ) : reels.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                            {reels.map((reel) => (
                                <div
                                    key={reel.id}
                                    onClick={() => setSelectedReel(reel)}
                                    className="relative aspect-9/12 bg-gray-100 dark:bg-gray-800 overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={reel.thumbnail_url || '/images/video-placeholder.png'}
                                        alt={reel.product_name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    {reel.type === 'image' && reel.images && reel.images.length > 1 && (
                                        <div className="absolute top-2 right-2">
                                            <div className="bg-black/60 rounded-full p-1">
                                                <Grid3X3 className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 flex items-center gap-3 text-white text-xs font-medium drop-shadow-lg">
                                        <div className="flex items-center gap-1">
                                            <Play className="h-3 w-3 fill-white" />
                                            <span>{formatViews(reel.views_count || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="h-3 w-3 fill-white" />
                                            <span>{formatViews(reel.likes_count || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
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

// Reel Player Component (Internal)
function ReelPlayer({ reel }: { reel: Reel }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [origin, setOrigin] = useState('');
    const mediaItems: { type: 'video' | 'image', url: string }[] = [];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    if (reel.video_url) mediaItems.push({ type: 'video', url: reel.video_url });
    if (reel.images) reel.images.forEach(img => mediaItems.push({ type: 'image', url: img }));
    if (mediaItems.length === 0 && reel.thumbnail_url) mediaItems.push({ type: 'image', url: reel.thumbnail_url });

    const currentItem = mediaItems[currentIndex];
    const isMulti = mediaItems.length > 1;

    // Helper for YouTube
    const getYouTubeVideoId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };
    const isYouTubeUrl = (url: string) => url?.includes('youtube.com') || url?.includes('youtu.be');

    useEffect(() => {
        setCurrentIndex(0);
    }, [reel]);

    const playVideo = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        }
    };

    // Retry play logic
    useEffect(() => {
        if (currentItem?.type === 'video' && isYouTubeUrl(currentItem.url)) {
            // Immediate attempt
            playVideo();
            // Retry sequence
            const timers = [
                setTimeout(playVideo, 500),
                setTimeout(playVideo, 1000),
                setTimeout(playVideo, 1500)
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [currentItem]);

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center group">
            {currentItem?.type === 'video' ? (
                isYouTubeUrl(currentItem.url) ? (
                    <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentItem.url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeVideoId(currentItem.url)}&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&origin=${origin}`}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        onLoad={playVideo}
                    />
                ) : (
                    <video
                        src={currentItem.url}
                        autoPlay
                        muted={isMuted}
                        controls={false}
                        loop
                        className="w-full h-full object-contain"
                        onClick={() => setIsMuted(!isMuted)}
                        ref={(el) => {
                            if (el) {
                                el.play().catch(() => {
                                    el.muted = true;
                                    el.play();
                                });
                            }
                        }}
                    />
                )
            ) : (
                <img src={currentItem?.url} className="w-full h-full object-contain" />
            )}

            {/* Navigation */}
            {isMulti && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? mediaItems.length - 1 : prev - 1); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-20"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % mediaItems.length); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-20"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {mediaItems.map((_, idx) => (
                            <div key={idx} className={cn("h-1.5 rounded-full transition-all", idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
                        ))}
                    </div>
                </>
            )}
            {/* Unmute Indication for Video */}
            {currentItem?.type === 'video' && !isYouTubeUrl(currentItem.url) && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted) }}
                    className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full z-20"
                >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
            )}
        </div>
    );
}
