import { Link } from '@inertiajs/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Heart, Share2, Volume2, VolumeX, Search, Play, Pause } from 'lucide-react';

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
    images?: string[]; // For carousel/gallery
    videoUrl?: string; // Video URL for video type
    type?: 'video' | 'image'; // Content type
}

// Sample Data (Need to be consistent with ReelsGrid)
const initialReels: Reel[] = [
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
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
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
        type: 'image',
        images: [
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop',
        ],
    },
    {
        id: 3,
        thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop',
        umkmName: 'Bakso Mas Budi',
        umkmId: 3,
        product: 'Bakso Urat Jumbo',
        description: 'Bakso urat jumbo dengan kuah kaldu sapi spesial #bakso #kuliner',
        whatsapp: '6281234567892',
        views: 2100,
        likes: 445,
        comments: 67,
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
];

// Additional reels for infinite scroll simulation
const moreReels: Reel[] = [
    {
        id: 4,
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop',
        umkmName: 'Sate Padang Ajo',
        umkmId: 4,
        product: 'Sate Padang Spesial',
        description: 'Sate Padang dengan kuah kacang kental #sate #padang',
        distance: '1.2km',
        whatsapp: '6281234567893',
        views: 3200,
        likes: 567,
        comments: 89,
        type: 'image',
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=600&fit=crop',
        ],
    },
    {
        id: 5,
        thumbnail: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop',
        umkmName: 'Martabak Manis Aneka',
        umkmId: 5,
        product: 'Martabak Coklat Keju',
        description: 'Martabak manis dengan topping melimpah #martabak #dessert',
        distance: '600m',
        whatsapp: '6281234567894',
        views: 1890,
        likes: 345,
        comments: 56,
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        id: 6,
        thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=600&fit=crop',
        umkmName: 'Es Cendol Dawet',
        umkmId: 6,
        product: 'Es Cendol Segar',
        description: 'Es cendol segar dengan gula merah asli #escendol #minuman',
        distance: '400m',
        whatsapp: '6281234567895',
        views: 980,
        likes: 234,
        comments: 34,
        type: 'image',
        images: [
            'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=600&fit=crop',
        ],
    },
];

export function VideoFeed() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Reels state for infinite scroll
    const [reels, setReels] = useState<Reel[]>(initialReels);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [likedReels, setLikedReels] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [expandedReels, setExpandedReels] = useState<number[]>([]);
    const [carouselIndexes, setCarouselIndexes] = useState<Record<number, number>>({});
    const [showHeartAnimation, setShowHeartAnimation] = useState<number | null>(null);
    const lastTapRef = useRef<{ time: number; reelId: number } | null>(null);

    // Video control states
    const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
    const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({});
    const [showControls, setShowControls] = useState<Record<number, boolean>>({});

    // Swipe handling for carousel
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const [isPaused, setIsPaused] = useState<Record<number, boolean>>({});

    // Load more reels (simulated API call)
    const loadMoreReels = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setReels(prev => {
                // Check if we already have the additional reels
                const existingIds = new Set(prev.map(r => r.id));
                const newReels = moreReels.filter(r => !existingIds.has(r.id));

                if (newReels.length === 0) {
                    setHasMore(false);
                    return prev;
                }
                return [...prev, ...newReels];
            });
            setIsLoading(false);
        }, 1000);
    }, [isLoading, hasMore]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreReels();
                }
            },
            { threshold: 0.5 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loadMoreReels, hasMore, isLoading]);

    // Navigate carousel manually
    const navigateCarousel = useCallback((reelId: number, direction: 'prev' | 'next', totalImages: number) => {
        setCarouselIndexes((prev) => {
            const currentIndex = prev[reelId] || 0;
            let nextIndex: number;
            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % totalImages;
            } else {
                nextIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
            }
            return { ...prev, [reelId]: nextIndex };
        });
        // Pause auto-slide when manually navigating
        setIsPaused((prev) => ({ ...prev, [reelId]: true }));
        // Resume auto-slide after 10 seconds
        setTimeout(() => {
            setIsPaused((prev) => ({ ...prev, [reelId]: false }));
        }, 10000);
    }, []);

    const goToSlide = useCallback((reelId: number, index: number) => {
        setCarouselIndexes((prev) => ({ ...prev, [reelId]: index }));
        setIsPaused((prev) => ({ ...prev, [reelId]: true }));
        setTimeout(() => {
            setIsPaused((prev) => ({ ...prev, [reelId]: false }));
        }, 10000);
    }, []);

    // Handle touch/swipe for carousel
    const handleTouchStart = (e: React.TouchEvent, reelId: number) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent, reelId: number, totalImages: number) => {
        if (!touchStartRef.current) return;
        const touchEnd = e.changedTouches[0];
        const deltaX = touchEnd.clientX - touchStartRef.current.x;
        const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);

        // Only trigger horizontal swipe if horizontal movement > vertical and threshold met
        if (Math.abs(deltaX) > 50 && deltaY < 100) {
            if (deltaX < 0) {
                navigateCarousel(reelId, 'next', totalImages);
            } else {
                navigateCarousel(reelId, 'prev', totalImages);
            }
            e.stopPropagation();
        }
        touchStartRef.current = null;
    };

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

    // Play/Pause videos based on active index
    useEffect(() => {
        Object.entries(videoRefs.current).forEach(([id, video]) => {
            if (video) {
                const reelIndex = reels.findIndex((r: Reel) => r.id === Number(id));
                if (reelIndex === activeIndex) {
                    video.play().catch(() => { }); // Auto-play active video
                } else {
                    video.pause();
                    video.currentTime = 0; // Reset to start
                }
            }
        });
    }, [activeIndex, reels]);

    // Update mute state for all videos
    useEffect(() => {
        Object.values(videoRefs.current).forEach((video) => {
            if (video) {
                video.muted = isMuted;
            }
        });
    }, [isMuted]);

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

    // Toggle video play/pause
    const toggleVideoPlay = (reelId: number) => {
        const video = videoRefs.current[reelId];
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(prev => ({ ...prev, [reelId]: true }));
            } else {
                video.pause();
                setIsPlaying(prev => ({ ...prev, [reelId]: false }));
            }
        }
    };

    // Handle video time update for progress bar
    const handleTimeUpdate = (reelId: number) => {
        const video = videoRefs.current[reelId];
        if (video && video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            setVideoProgress(prev => ({ ...prev, [reelId]: progress }));
        }
    };

    // Handle seeking via progress bar
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>, reelId: number) => {
        const video = videoRefs.current[reelId];
        if (video && video.duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = percentage * video.duration;
        }
    };

    // Handle video play/pause events  
    const handleVideoPlay = (reelId: number) => {
        setIsPlaying(prev => ({ ...prev, [reelId]: true }));
    };

    const handleVideoPause = (reelId: number) => {
        setIsPlaying(prev => ({ ...prev, [reelId]: false }));
    };

    // Show/hide controls with timeout
    const showControlsTimeout = useRef<Record<number, NodeJS.Timeout>>({});

    const handleShowControls = (reelId: number) => {
        setShowControls(prev => ({ ...prev, [reelId]: true }));

        // Clear existing timeout
        if (showControlsTimeout.current[reelId]) {
            clearTimeout(showControlsTimeout.current[reelId]);
        }

        // Hide after 3 seconds
        showControlsTimeout.current[reelId] = setTimeout(() => {
            setShowControls(prev => ({ ...prev, [reelId]: false }));
        }, 3000);
    };

    // Dragging state for progress bar
    const [isDragging, setIsDragging] = useState<Record<number, boolean>>({});

    // Seek video to position based on X coordinate
    const seekToPosition = (reelId: number, clientX: number, element: HTMLElement) => {
        const video = videoRefs.current[reelId];
        if (video && video.duration) {
            const rect = element.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = x / rect.width;
            video.currentTime = percentage * video.duration;
            setVideoProgress(prev => ({ ...prev, [reelId]: percentage * 100 }));
        }
    };

    // Mouse drag handlers
    const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>, reelId: number) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDragging(prev => ({ ...prev, [reelId]: true }));
        seekToPosition(reelId, e.clientX, e.currentTarget);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            seekToPosition(reelId, moveEvent.clientX, e.currentTarget);
        };

        const handleMouseUp = () => {
            setIsDragging(prev => ({ ...prev, [reelId]: false }));
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Touch drag handlers  
    const handleProgressTouchStart = (e: React.TouchEvent<HTMLDivElement>, reelId: number) => {
        e.stopPropagation();
        setIsDragging(prev => ({ ...prev, [reelId]: true }));
        seekToPosition(reelId, e.touches[0].clientX, e.currentTarget);
    };

    const handleProgressTouchMove = (e: React.TouchEvent<HTMLDivElement>, reelId: number) => {
        e.stopPropagation();
        if (isDragging[reelId]) {
            seekToPosition(reelId, e.touches[0].clientX, e.currentTarget);
        }
    };

    const handleProgressTouchEnd = (e: React.TouchEvent<HTMLDivElement>, reelId: number) => {
        e.stopPropagation();
        setIsDragging(prev => ({ ...prev, [reelId]: false }));
    };

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

    // Share video/profile handler
    const handleShare = async (reel: Reel) => {
        const shareUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/umkm/${reel.umkmId || reel.id}`
            : `https://umkmku.com/umkm/${reel.umkmId || reel.id}`;

        const shareData = {
            title: reel.umkmName,
            text: `Lihat ${reel.product} dari ${reel.umkmName} di UMKMku!`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link berhasil disalin!');
            }
        } catch (err) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link berhasil disalin!');
            } catch {
                console.error('Failed to share');
            }
        }
    };

    // Handle double tap to like
    const handleDoubleTap = (reelId: number) => {
        const now = Date.now();
        const lastTap = lastTapRef.current;

        if (lastTap && lastTap.reelId === reelId && now - lastTap.time < 300) {
            // Double tap detected
            if (!likedReels.includes(reelId)) {
                toggleLike(reelId);
            }
            setShowHeartAnimation(reelId);
            setTimeout(() => setShowHeartAnimation(null), 1000);
            lastTapRef.current = null;
        } else {
            lastTapRef.current = { time: now, reelId };
        }
    };

    // Auto-slide carousel for image galleries
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = [];

        reels.forEach((reel: Reel) => {
            if (reel.type === 'image' && reel.images && reel.images.length > 1) {
                const interval = setInterval(() => {
                    // Skip auto-slide if paused
                    if (isPaused[reel.id]) return;

                    setCarouselIndexes((prev) => {
                        const currentIndex = prev[reel.id] || 0;
                        const nextIndex = (currentIndex + 1) % reel.images!.length;
                        return { ...prev, [reel.id]: nextIndex };
                    });
                }, 5000);
                intervals.push(interval);
            }
        });

        return () => intervals.forEach(clearInterval);
    }, [isPaused, reels]);



    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="h-[calc(100dvh-4rem)] w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar scroll-smooth bg-black md:bg-gray-50 dark:md:bg-gray-900"
        >
            {reels.map((reel: Reel, index: number) => {
                const isLiked = likedReels.includes(reel.id);
                const isExpanded = expandedReels.includes(reel.id);
                const description = reel.description || `Menikmati ${reel.product} yang lezat. #kuliner #umkm`;
                const currentCarouselIndex = carouselIndexes[reel.id] || 0;
                const isImageGallery = reel.type === 'image' && reel.images && reel.images.length > 0;
                const displayImage = isImageGallery ? reel.images![currentCarouselIndex] : reel.thumbnail;

                return (
                    <div
                        key={reel.id}
                        className="relative h-full w-full snap-center snap-always flex items-center justify-center pb-5 md:pb-5"
                        onDoubleClick={() => handleDoubleTap(reel.id)}
                        onTouchEnd={(e) => {
                            if (e.touches.length === 0) handleDoubleTap(reel.id);
                        }}
                    >
                        {/* Desktop Layout Container */}
                        <div className="relative flex h-full w-full md:w-auto md:max-w-4xl items-center justify-center gap-4">

                            {/* Video/Image Player Container */}
                            <div
                                className="relative h-full w-full md:aspect-[9/16] md:h-[95%] md:w-auto overflow-hidden bg-gray-900 shadow-2xl flex items-center justify-center"
                                onTouchStart={(e) => isImageGallery && handleTouchStart(e, reel.id)}
                                onTouchEnd={(e) => isImageGallery && reel.images && handleTouchEnd(e, reel.id, reel.images.length)}
                            >
                                {/* Video/Image/Carousel Display */}
                                <div className="relative h-full w-full overflow-hidden">
                                    {/* Video Player */}
                                    {reel.type === 'video' && reel.videoUrl ? (
                                        <div
                                            className="relative h-full w-full"
                                            onClick={() => {
                                                toggleVideoPlay(reel.id);
                                                handleShowControls(reel.id);
                                            }}
                                            onMouseMove={() => handleShowControls(reel.id)}
                                        >
                                            <video
                                                ref={(el) => { videoRefs.current[reel.id] = el; }}
                                                src={reel.videoUrl}
                                                poster={reel.thumbnail}
                                                loop
                                                muted={isMuted}
                                                playsInline
                                                className="h-full w-full object-cover object-center"
                                                onTimeUpdate={() => handleTimeUpdate(reel.id)}
                                                onPlay={() => handleVideoPlay(reel.id)}
                                                onPause={() => handleVideoPause(reel.id)}
                                            />

                                            {/* Play/Pause Overlay Icon */}
                                            <div className={cn(
                                                "absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
                                                showControls[reel.id] || !isPlaying[reel.id] ? "opacity-100" : "opacity-0"
                                            )}>
                                                <div className="p-4 rounded-full bg-black/40 backdrop-blur-sm">
                                                    {isPlaying[reel.id] ? (
                                                        <Pause className="h-10 w-10 text-white" />
                                                    ) : (
                                                        <Play className="h-10 w-10 text-white fill-white ml-1" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress Bar Container - Draggable */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-8 flex items-end cursor-pointer z-30 pointer-events-auto px-2 pb-2"
                                                onMouseDown={(e) => handleProgressMouseDown(e, reel.id)}
                                                onTouchStart={(e) => handleProgressTouchStart(e, reel.id)}
                                                onTouchMove={(e) => handleProgressTouchMove(e, reel.id)}
                                                onTouchEnd={(e) => handleProgressTouchEnd(e, reel.id)}
                                            >
                                                {/* Visible Progress Bar */}
                                                <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden relative">
                                                    <div
                                                        className={cn(
                                                            "h-full bg-white rounded-full",
                                                            isDragging[reel.id] ? "" : "transition-all duration-100"
                                                        )}
                                                        style={{ width: `${videoProgress[reel.id] || 0}%` }}
                                                    />
                                                    {/* Drag Handle */}
                                                    <div
                                                        className={cn(
                                                            "absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-md transition-transform",
                                                            isDragging[reel.id] ? "scale-125" : "scale-100"
                                                        )}
                                                        style={{ left: `calc(${videoProgress[reel.id] || 0}% - 6px)` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : isImageGallery && reel.images ? (
                                        /* Image Carousel */
                                        reel.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`${reel.product} ${idx + 1}`}
                                                className={cn(
                                                    "absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-all duration-500 ease-in-out",
                                                    idx === currentCarouselIndex
                                                        ? "translate-x-0 opacity-90"
                                                        : idx < currentCarouselIndex
                                                            ? "-translate-x-full opacity-0"
                                                            : "translate-x-full opacity-0"
                                                )}
                                            />
                                        ))
                                    ) : (
                                        /* Single Image */
                                        <img
                                            src={displayImage}
                                            alt={reel.product}
                                            className="h-full w-full object-cover object-center opacity-90"
                                        />
                                    )}
                                </div>

                                {/* Carousel Indicators for Image Galleries - Clickable */}
                                {isImageGallery && reel.images!.length > 1 && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                        {reel.images!.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToSlide(reel.id, idx);
                                                }}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:opacity-100",
                                                    idx === currentCarouselIndex
                                                        ? "w-8 bg-white"
                                                        : "w-2 bg-white/50 hover:bg-white/70"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Double Tap Heart Animation */}
                                {showHeartAnimation === reel.id && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                        <Heart className="h-24 w-24 text-white fill-white animate-ping" />
                                    </div>
                                )}

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
                                <WhatsAppButton />

                                <ActionButton icon={Share2} label="Share" onClick={() => handleShare(reel)} />

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
                                        disabled={index === reels.length - 1}
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
                                <WhatsAppButton overlay />

                                <ActionButton icon={Share2} label="Share" color="text-white" overlay onClick={() => handleShare(reel)} />
                            </div>

                            {/* Mobile Top Right Search Button */}
                            <div className="absolute top-4 right-4 z-20 md:hidden">
                                <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-all active:scale-95">
                                    <Search className="h-6 w-6" />
                                </Link>
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* Loading Indicator for Infinite Scroll */}
            <div
                ref={loadMoreRef}
                className="flex items-center justify-center h-20 w-full snap-center"
            >
                {isLoading && (
                    <div className="flex items-center gap-2 text-white">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        <span className="text-sm">Memuat lebih banyak...</span>
                    </div>
                )}
                {!hasMore && reels.length > 3 && (
                    <p className="text-white/60 text-sm">Sudah mencapai akhir</p>
                )}
            </div>
        </div>
    );
}

// WhatsApp Button Component with Animation
function WhatsAppButton({ overlay = false }: { overlay?: boolean }) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 300);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex flex-col items-center gap-1 group transition-all duration-200",
                isPressed ? "scale-90" : "scale-100 active:scale-95",
                overlay ? "text-white" : "text-gray-800 dark:text-gray-200"
            )}
        >
            <div className={cn(
                "rounded-full p-3 transition-all duration-200 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20",
                overlay && "bg-green-500/90 backdrop-blur-sm",
                isPressed && "ring-2 ring-white/50 scale-110"
            )}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={cn(
                    "h-6 w-6 md:h-7 md:w-7 transition-all duration-200",
                    isPressed && "scale-110"
                )}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </div>
            <span className={cn("text-xs font-semibold", overlay ? "drop-shadow-md" : "")}>Pesan</span>
        </button>
    );
}

// Action Button Component with Animation
function ActionButton({ icon: Icon, label, color = "", fill = false, overlay = false, onClick }: { icon: any, label: string | number, color?: string, fill?: boolean, overlay?: boolean, onClick?: () => void }) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.(); // Call immediately for faster response
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200); // Reduced animation time
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex flex-col items-center gap-1 group transition-all duration-200",
                isPressed ? "scale-90" : "scale-100 active:scale-95",
                overlay ? "text-white" : "text-gray-800 dark:text-gray-200"
            )}>
            <div className={cn(
                "rounded-full p-3 transition-all duration-200",
                overlay ? "bg-black/20 backdrop-blur-sm hover:bg-black/30" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                isPressed && "ring-2 ring-white/50"
            )}>
                <Icon className={cn(
                    "h-6 w-6 md:h-7 md:w-7 transition-all duration-200",
                    color,
                    fill ? "fill-red-500" : "",
                    isPressed && "scale-110"
                )} />
            </div>
            <span className={cn("text-xs font-semibold", overlay ? "drop-shadow-md" : "")}>{label}</span>
        </button>
    );
}

