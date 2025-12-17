import { Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Heart, MessageCircle, Share2, Music2, Volume2, VolumeX, Store, Play, PlusSquare, ShoppingBag, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Reuse Reel type
interface Reel {
    id: number;
    thumbnail: string;
    umkmName: string;
    umkmId?: number;
    product: string;
    description?: string;
    whatsapp: string;
    views: number;
    likes: number;
    comments: number;
    distance?: string;
}

// Sample Data (Need to be consistent with ReelsGrid)
const sampleReels: Reel[] = [
    {
        id: 1,
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
        umkmName: 'Warung Gudeg Bu Tini',
        umkmId: 1,
        product: 'Nasi Gudeg Spesial',
        description: 'Menikmati Nasi Gudeg Spesial yang lezat dan otentik. #kuliner #umkm #warung',
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
        description: 'Kopi Susu Gula Aren khas kami, dibuat dengan biji kopi pilihan.',
        distance: '800m',
        whatsapp: '6281234567891',
        views: 856,
        likes: 189,
        comments: 28,
    },
    // Add more mock data later or fetch from API
    {
        id: 3,
        thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop',
        umkmName: 'Bakso Mas Budi',
        umkmId: 3,
        product: 'Bakso Urat Jumbo',
        whatsapp: '6281234567892',
        views: 2100,
        likes: 445,
        comments: 67,
    },
];


export function VideoFeed() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [likedReels, setLikedReels] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [expandedReels, setExpandedReels] = useState<number[]>([]);

    // Scroll active reel into view
    const scrollToReel = (index: number) => {
        if (containerRef.current) {
            const height = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: height * index,
                behavior: 'smooth',
            });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const height = containerRef.current.clientHeight;
        const index = Math.round(scrollTop / height);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    const toggleLike = (id: number) => {
        setLikedReels(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleExpand = (id: number) => {
        setExpandedReels(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="h-[calc(100dvh-4rem)] w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar scroll-smooth bg-black md:bg-gray-50 dark:md:bg-gray-900"
        >
            {sampleReels.map((reel, index) => {
                const isLiked = likedReels.includes(reel.id);
                const isExpanded = expandedReels.includes(reel.id);
                const description = reel.description || `Menikmati ${reel.product} yang lezat. #kuliner #umkm`;

                return (
                    <div
                        key={reel.id}
                        className="relative h-full w-full snap-center snap-always flex items-center justify-center p-4 md:p-4"
                    >
                        {/* Desktop Layout Container */}
                        <div className="relative flex h-full w-full md:w-auto md:max-w-4xl items-center justify-center gap-4">

                            {/* Video Player Container */}
                            <div className="relative h-full w-full rounded-xl md:aspect-[9/16] md:h-[95%] md:w-auto md:rounded-xl overflow-hidden bg-gray-900 shadow-2xl flex items-center justify-center">
                                {/* Image as Video Placeholder */}
                                <img
                                    src={reel.thumbnail}
                                    alt={reel.product}
                                    className="h-full w-full object-cover object-center opacity-90"
                                />

                                {/* Overlay Gradient (Mobile Style) */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

                                {/* Mute Button */}
                                <button
                                    onClick={toggleMute}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
                                >
                                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </button>

                                {/* Info Overlay (Inside Video) */}
                                <div className="absolute bottom-0 left-0 w-[70%] p-4 pb-2 md:pb-4 text-white z-10">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold drop-shadow-md hover:underline cursor-pointer">@{reel.umkmName.replace(/\s+/g, '').toLowerCase()}</h3>
                                        <p className={cn("text-sm drop-shadow-md opacity-90 mt-1", !isExpanded && "line-clamp-2")}>
                                            {description}
                                        </p>
                                        {description.length > 60 && (
                                            <button
                                                onClick={() => toggleExpand(reel.id)}
                                                className="text-teal-400 font-medium text-sm hover:underline mt-1"
                                            >
                                                {isExpanded ? 'sembunyikan' : 'selengkapnya'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <Music2 className="h-3 w-3 animate-spin-slow" />
                                        <span className="truncate max-w-[180px]">Original Sound - {reel.umkmName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Actions (Right Side Buttons like TikTok Desktop) */}
                            <div className="hidden md:flex flex-col gap-4 items-center justify-end h-[95%] pb-10">
                                {/* Profile Button */}
                                <Link href={`/umkm/${reel.umkmId || reel.id}`} className="relative mb-2 cursor-pointer group">
                                    <div className="h-12 w-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-gray-800 transition-transform group-hover:scale-105">
                                        <img src={`https://ui-avatars.com/api/?name=${reel.umkmName}&background=random`} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                                    </div>
                                </Link>

                                <ActionButton
                                    icon={Heart}
                                    label={reel.likes + (isLiked ? 1 : 0)}
                                    color={isLiked ? "text-red-500" : "text-gray-800 dark:text-gray-200"}
                                    fill={isLiked}
                                    onClick={() => toggleLike(reel.id)}
                                />

                                {/* WhatsApp Button */}
                                <button className="flex flex-col items-center gap-1 group transition-transform active:scale-95 text-gray-800 dark:text-gray-200">
                                    <div className="rounded-full p-3 transition-colors bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold">Pesan</span>
                                </button>

                                <ActionButton icon={Share2} label="Share" onClick={() => { }} />

                                {/* Navigation Arrows */}
                                <div className="mt-8 flex flex-col gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-lg border border-gray-200"
                                        onClick={() => scrollToReel(index - 1)}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-lg border border-gray-200"
                                        onClick={() => scrollToReel(index + 1)}
                                        disabled={index === sampleReels.length - 1}
                                    >
                                        <ArrowDown className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Actions (Overlay Right) */}
                            <div className="absolute bottom-[130px] right-2 flex flex-col items-center gap-4 md:hidden z-20">
                                <Link href={`/umkm/${reel.umkmId || reel.id}`} className="relative">
                                    <div className="h-10 w-10 rounded-full border border-white p-0.5">
                                        <img src={`https://ui-avatars.com/api/?name=${reel.umkmName}`} className="h-full w-full rounded-full" />
                                    </div>
                                </Link>
                                <ActionButton
                                    icon={Heart}
                                    label={reel.likes + (isLiked ? 1 : 0)}
                                    color={isLiked ? "text-red-500" : "text-white"}
                                    fill={isLiked}
                                    overlay
                                    onClick={() => toggleLike(reel.id)}
                                />

                                {/* Mobile WhatsApp Button */}
                                <button className="flex flex-col items-center gap-1 group transition-transform active:scale-95 text-white">
                                    <div className="rounded-full p-3 transition-colors bg-black/20 backdrop-blur-sm">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold drop-shadow-md">Pesan</span>
                                </button>

                                <ActionButton icon={Share2} label="Share" color="text-white" overlay onClick={() => { }} />
                            </div>

                            {/* Mobile Top Right Search Button */}
                            <div className="absolute top-4 right-4 z-20 md:hidden">
                                <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white">
                                    <Search className="h-6 w-6" />
                                </Link>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ActionButton({ icon: Icon, label, color = "", fill = false, overlay = false, onClick }: { icon: any, label: string | number, color?: string, fill?: boolean, overlay?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1 group transition-transform active:scale-95",
                overlay ? "text-white" : "text-gray-800 dark:text-gray-200"
            )}>
            <div className={cn(
                "rounded-full p-3 transition-colors",
                overlay ? "bg-black/20 backdrop-blur-sm" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            )}>
                <Icon className={cn("h-6 w-6 md:h-7 md:w-7", color, fill ? "fill-red-500" : "")} />
            </div>
            <span className={cn("text-xs font-semibold", overlay ? "drop-shadow-md" : "")}>{label}</span>
        </button>
    );
}
