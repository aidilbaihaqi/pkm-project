import { Link } from '@inertiajs/react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Heart, Share2, Volume2, VolumeX, Search, Play, Pause, ChevronLeft, Loader2 } from 'lucide-react';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';
import EngagementController from '@/actions/App/Http/Controllers/Engagement/EngagementController';

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Match various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

// Check if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
}

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

// Internal Reel type for component
interface Reel {
    id: number;
    thumbnail: string;
    umkmName: string;
    umkmId: number;
    product: string;
    description?: string;
    whatsapp: string;
    whatsappLink: string;
    views: number;
    likes: number;
    comments: number;
    distance?: string;
    images?: string[];
    videoUrl?: string;
    type: 'video' | 'image';
    orientation?: 'portrait' | 'landscape';
}

// Transform API response to internal Reel type
function transformApiReel(apiReel: ApiReel): Reel {
    return {
        id: apiReel.id,
        thumbnail: apiReel.thumbnail_url || `https://img.youtube.com/vi/default/mqdefault.jpg`,
        umkmName: apiReel.umkm_profile.nama_toko,
        umkmId: apiReel.umkm_profile.id,
        product: apiReel.product_name,
        description: apiReel.caption || undefined,
        whatsapp: '',
        whatsappLink: apiReel.whatsapp_link,
        views: 0,
        likes: 0,
        comments: 0,
        distance: apiReel.distance_km ? `${apiReel.distance_km}km` : undefined,
        videoUrl: apiReel.video_url || undefined,
        type: apiReel.type,
        orientation: 'portrait',
    };
}

interface VideoFeedProps {
    lat?: number;
    lng?: number;
    radius?: number;
}

export function VideoFeed({ lat = -7.7956, lng = 110.3695, radius = 10 }: VideoFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
    const youtubeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Reels state for infinite scroll
    const [reels, setReels] = useState<Reel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showEndMessage, setShowEndMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Fetch reels from API
    const fetchReels = useCallback(async (page: number, append: boolean = false) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const response = await fetch(
                ReelsController.index.url({
                    query: { lat: lat.toString(), lng: lng.toString(), radius: radius.toString(), page: page.toString(), per_page: '10' }
                })
            );

            if (!response.ok) {
                throw new Error('Failed to fetch reels');
            }

            const data = await response.json();
            const transformedReels = (data.data || []).map(transformApiReel);

            if (append) {
                setReels(prev => [...prev, ...transformedReels]);
            } else {
                setReels(transformedReels);
            }

            // Check if there are more pages
            if (data.meta) {
                setHasMore(data.meta.current_page < data.meta.last_page);
            } else {
                setHasMore(transformedReels.length >= 10);
            }
        } catch (err) {
            console.error('Error fetching reels:', err);
            setError('Gagal memuat konten. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [lat, lng, radius]);

    // Initial fetch
    useEffect(() => {
        fetchReels(1);
    }, [fetchReels]);

    // Handle end of feed message
    useEffect(() => {
        if (!hasMore && !isLoading && !isLoadingMore && reels.length > 0) {
            setShowEndMessage(true);
            const timer = setTimeout(() => {
                setShowEndMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hasMore, isLoading, isLoadingMore, reels.length]);

    // Load more reels
    const loadMoreReels = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchReels(nextPage, true);
    }, [isLoadingMore, hasMore, currentPage, fetchReels]);

    // Auto-hide end message and scroll back to last reel
    useEffect(() => {
        if (!hasMore && reels.length > 0) {
            setShowEndMessage(true);
            const timer = setTimeout(() => {
                setShowEndMessage(false);
                if (containerRef.current) {
                    const height = containerRef.current.clientHeight;
                    containerRef.current.scrollTo({
                        top: (reels.length - 1) * height,
                        behavior: 'smooth'
                    });
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasMore, reels.length]);

    const [likedReels, setLikedReels] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false); // Default unmuted (sound ON)
    const [expandedReels, setExpandedReels] = useState<number[]>([]);
    const [viewedReels, setViewedReels] = useState<Set<number>>(new Set());
    const [carouselIndexes, setCarouselIndexes] = useState<Record<number, number>>({});
    const [showHeartAnimation, setShowHeartAnimation] = useState<number | null>(null);
    const lastTapRef = useRef<{ time: number; reelId: number } | null>(null);

    // Video control states
    const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
    const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({});
    const [showControls, setShowControls] = useState<Record<number, boolean>>({});
    const [isPaused, setIsPaused] = useState<Record<number, boolean>>({});
    const [mobileViewMode, setMobileViewMode] = useState<Record<number, 'portrait' | 'landscape'>>({});
    const [videoDuration, setVideoDuration] = useState<Record<number, number>>({});
    const [videoCurrentTime, setVideoCurrentTime] = useState<Record<number, number>>({});
    const lastProgressUpdateRef = useRef<Record<number, number>>({});
    const [isDragging, setIsDragging] = useState<Record<number, boolean>>({});
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const showControlsTimeout = useRef<Record<number, NodeJS.Timeout>>({});

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    loadMoreReels();
                }
            },
            { threshold: 0.5 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loadMoreReels, hasMore, isLoadingMore]);

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
        setIsPaused((prev) => ({ ...prev, [reelId]: true }));
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

    const handleTouchStart = (e: React.TouchEvent, reelId: number) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent, reelId: number, totalImages: number) => {
        if (!touchStartRef.current) return;
        const touchEnd = e.changedTouches[0];
        const deltaX = touchEnd.clientX - touchStartRef.current.x;
        const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);

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
        // Reset isPaused for all videos when active index changes
        const activeReelId = reels[activeIndex]?.id;
        if (activeReelId !== undefined) {
            // Reset isPaused: active video starts fresh, inactive videos are paused
            setIsPaused(prev => {
                const newState: Record<number, boolean> = {};
                reels.forEach((reel, idx) => {
                    newState[reel.id] = idx !== activeIndex; // Pause non-active, unpause active
                });
                return newState;
            });
        }

        Object.entries(videoRefs.current).forEach(([id, video]) => {
            if (video) {
                const reelIndex = reels.findIndex((r: Reel) => r.id === Number(id));
                if (reelIndex === activeIndex) {
                    video.play().catch(() => { });
                    setIsPlaying(prev => ({ ...prev, [Number(id)]: true }));
                } else {
                    video.pause();
                    video.currentTime = 0;
                    setIsPlaying(prev => ({ ...prev, [Number(id)]: false }));
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
            if (reels[index] && !viewedReels.has(reels[index].id)) {
                trackView(reels[index]);
            }
        }
    };

    // Track view event via API
    const trackView = async (reel: Reel) => {
        setViewedReels(prev => new Set([...prev, reel.id]));
        try {
            await fetch(EngagementController.recordEvent.url({ reelId: reel.id }), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ event_type: 'view' }),
            });
        } catch (err) {
            console.error('Failed to track view:', err);
        }
    };

    // Track engagement event
    const trackEngagement = async (reelId: number, eventType: 'like' | 'share' | 'click_wa') => {
        try {
            await fetch(EngagementController.recordEvent.url({ reelId }), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ event_type: eventType }),
            });
        } catch (err) {
            console.error(`Failed to track ${eventType}:`, err);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    const toggleVideoPlay = (reelId: number) => {
        const video = videoRefs.current[reelId];
        const youtubeIframe = youtubeRefs.current[reelId];

        if (video) {
            // Regular video element
            if (video.paused) {
                video.play();
                setIsPlaying(prev => ({ ...prev, [reelId]: true }));
                setIsPaused(prev => ({ ...prev, [reelId]: false }));
            } else {
                video.pause();
                setIsPlaying(prev => ({ ...prev, [reelId]: false }));
                setIsPaused(prev => ({ ...prev, [reelId]: true }));
            }
        } else if (youtubeIframe && youtubeIframe.contentWindow) {
            // YouTube iframe - use postMessage API to pause/play without reload
            const currentlyPaused = isPaused[reelId];
            if (currentlyPaused) {
                // Resume playing
                youtubeIframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo' }),
                    '*'
                );
                setIsPaused(prev => ({ ...prev, [reelId]: false }));
            } else {
                // Pause
                youtubeIframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'pauseVideo' }),
                    '*'
                );
                setIsPaused(prev => ({ ...prev, [reelId]: true }));
            }
        } else {
            // Fallback - just toggle state
            setIsPaused(prev => ({ ...prev, [reelId]: !prev[reelId] }));
        }
    };

    const handleTimeUpdate = (reelId: number) => {
        const video = videoRefs.current[reelId];
        if (video && video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            setVideoProgress(prev => ({ ...prev, [reelId]: progress }));
            setVideoCurrentTime(prev => ({ ...prev, [reelId]: video.currentTime }));
            setVideoDuration(prev => ({ ...prev, [reelId]: video.duration }));
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVideoPlay = (reelId: number) => {
        setIsPlaying(prev => ({ ...prev, [reelId]: true }));
    };

    const handleVideoPause = (reelId: number) => {
        setIsPlaying(prev => ({ ...prev, [reelId]: false }));
    };

    const handleShowControls = (reelId: number) => {
        setShowControls(prev => ({ ...prev, [reelId]: true }));
        if (showControlsTimeout.current[reelId]) {
            clearTimeout(showControlsTimeout.current[reelId]);
        }
        showControlsTimeout.current[reelId] = setTimeout(() => {
            setShowControls(prev => ({ ...prev, [reelId]: false }));
        }, 3000);
    };

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
        const wasLiked = likedReels.includes(id);
        setLikedReels(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        if (!wasLiked) {
            trackEngagement(id, 'like');
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedReels(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleVideoTap = (reelId: number) => {
        const now = Date.now();
        const lastTap = lastTapRef.current;

        if (lastTap && lastTap.reelId === reelId && now - lastTap.time < 300) {
            if (!likedReels.includes(reelId)) {
                toggleLike(reelId);
                setShowHeartAnimation(reelId);
                setTimeout(() => setShowHeartAnimation(null), 800);
            }
            lastTapRef.current = null;
        } else {
            lastTapRef.current = { time: now, reelId };
            setTimeout(() => {
                if (lastTapRef.current?.reelId === reelId && lastTapRef.current?.time === now) {
                    toggleVideoPlay(reelId);
                    lastTapRef.current = null;
                }
            }, 300);
        }
    };

    const handleShare = async (reel: Reel) => {
        const shareUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/umkm/${reel.umkmId}`
            : `https://umkmku.com/umkm/${reel.umkmId}`;

        const shareData = {
            title: reel.umkmName,
            text: `Lihat ${reel.product} dari ${reel.umkmName} di UMKMku!`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                trackEngagement(reel.id, 'share');
            } else {
                await navigator.clipboard.writeText(shareUrl);
                trackEngagement(reel.id, 'share');
                alert('Link berhasil disalin!');
            }
        } catch (err) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                trackEngagement(reel.id, 'share');
                alert('Link berhasil disalin!');
            } catch {
                console.error('Failed to share');
            }
        }
    };

    const handleDoubleTap = (reelId: number) => {
        const now = Date.now();
        const lastTap = lastTapRef.current;

        if (lastTap && lastTap.reelId === reelId && now - lastTap.time < 300) {
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

    // Loading state
    if (isLoading) {
        return (
            <div className="h-[calc(100dvh-4rem)] w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                    <p className="text-white text-sm">Memuat konten...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-[calc(100dvh-4rem)] w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <p className="text-white text-sm">{error}</p>
                    <Button onClick={() => fetchReels(1)} variant="outline" className="text-white border-white">
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    // Empty state
    if (reels.length === 0) {
        return (
            <div className="h-[calc(100dvh-4rem)] w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <p className="text-white text-lg font-medium">Belum ada konten</p>
                    <p className="text-gray-400 text-sm">Tidak ada UMKM dalam radius yang ditentukan</p>
                </div>
            </div>
        );
    }

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
                    <React.Fragment key={reel.id}>
                        <div
                            className={cn(
                                "relative h-full w-full snap-center snap-always pb-5 md:pb-5 select-none",
                                reel.orientation === 'landscape'
                                    ? mobileViewMode[reel.id] === 'landscape'
                                        ? "flex flex-col items-center justify-center"
                                        : "flex flex-col md:flex-col items-center justify-center"
                                    : "flex items-center justify-center"
                            )}
                            onDoubleClick={() => handleDoubleTap(reel.id)}
                            onTouchEnd={(e) => {
                                if (e.touches.length === 0) handleDoubleTap(reel.id);
                            }}
                        >
                            <div className={cn(
                                "relative flex items-center justify-center",
                                reel.orientation === 'landscape'
                                    ? "w-full h-full md:w-auto md:max-w-4xl md:flex-row md:gap-8"
                                    : "h-full w-full"
                            )}>
                                <div
                                    className={cn(
                                        "relative overflow-hidden bg-black shadow-2xl flex items-center justify-center",
                                        reel.orientation === 'landscape'
                                            ? "w-full aspect-video max-w-full"
                                            : "w-full h-full md:aspect-[9/16] md:h-[95%] md:w-auto"
                                    )}
                                    onTouchStart={(e) => isImageGallery && handleTouchStart(e, reel.id)}
                                    onTouchEnd={(e) => isImageGallery && reel.images && handleTouchEnd(e, reel.id, reel.images.length)}
                                >
                                    <div className={cn(
                                        "relative w-full overflow-hidden",
                                        reel.orientation === 'landscape' ? "h-full" : "h-full"
                                    )}>
                                        {reel.type === 'video' && reel.videoUrl ? (
                                            // Check if it's a YouTube URL
                                            isYouTubeUrl(reel.videoUrl) ? (
                                                <div
                                                    className="relative h-full w-full flex items-center justify-center bg-black overflow-hidden cursor-pointer"
                                                    onClick={() => {
                                                        handleVideoTap(reel.id);
                                                        handleShowControls(reel.id);
                                                    }}
                                                    onMouseMove={() => handleShowControls(reel.id)}
                                                >
                                                    {/* Scale up iframe to hide YouTube branding */}
                                                    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'scale(1.2)' }}>
                                                        <iframe
                                                            ref={(el) => { youtubeRefs.current[reel.id] = el; }}
                                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(reel.videoUrl)}?autoplay=${index === activeIndex ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${getYouTubeVideoId(reel.videoUrl)}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`}
                                                            className="w-full h-full"
                                                            style={{ border: 'none', pointerEvents: 'none' }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        />
                                                    </div>
                                                    {/* Play/Pause Indicator - only show when explicitly paused */}
                                                    {isPaused[reel.id] && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                                            <div className="p-4 rounded-full bg-black/40 backdrop-blur-sm">
                                                                <Play className="h-10 w-10 text-white fill-white ml-1" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {showHeartAnimation === reel.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                                                            <Heart className="h-24 w-24 text-red-500 fill-red-500 animate-ping" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                // Regular video file
                                                <div
                                                    className="relative h-full w-full flex items-center justify-center bg-black"
                                                    onClick={() => {
                                                        handleVideoTap(reel.id);
                                                        handleShowControls(reel.id);
                                                    }}
                                                    onMouseMove={() => handleShowControls(reel.id)}
                                                >
                                                    <video
                                                        ref={(el) => { videoRefs.current[reel.id] = el; }}
                                                        src={reel.videoUrl}
                                                        autoPlay
                                                        loop
                                                        muted={isMuted}
                                                        playsInline
                                                        className={cn(
                                                            "h-full w-full object-center",
                                                            reel.orientation === 'landscape'
                                                                ? "object-contain bg-black"
                                                                : "object-cover"
                                                        )}
                                                        onTimeUpdate={() => handleTimeUpdate(reel.id)}
                                                        onPlay={() => handleVideoPlay(reel.id)}
                                                        onPause={() => handleVideoPause(reel.id)}
                                                    />
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
                                                    {showHeartAnimation === reel.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                                                            <Heart className="h-24 w-24 text-red-500 fill-red-500 animate-ping" />
                                                        </div>
                                                    )}
                                                    {/* Progress Bar */}
                                                    <div className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
                                                        <div className="flex items-center gap-2 text-white text-xs">
                                                            <span className="tabular-nums min-w-[32px]">
                                                                {formatTime(videoCurrentTime[reel.id] || 0)}
                                                            </span>
                                                            <div
                                                                className="relative flex-1 h-1 bg-white/30 rounded-full cursor-pointer group"
                                                                onMouseDown={(e) => handleProgressMouseDown(e, reel.id)}
                                                                onTouchStart={(e) => handleProgressTouchStart(e, reel.id)}
                                                                onTouchMove={(e) => handleProgressTouchMove(e, reel.id)}
                                                                onTouchEnd={(e) => handleProgressTouchEnd(e, reel.id)}
                                                            >
                                                                <div
                                                                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
                                                                    style={{ width: `${videoProgress[reel.id] || 0}%` }}
                                                                />
                                                                <div
                                                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    style={{ left: `calc(${videoProgress[reel.id] || 0}% - 6px)` }}
                                                                />
                                                            </div>
                                                            <span className="tabular-nums min-w-[32px]">
                                                                {formatTime(videoDuration[reel.id] || 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ) : isImageGallery && reel.images ? (
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
                                            <img
                                                src={displayImage}
                                                alt={reel.product}
                                                className="h-full w-full object-cover object-center opacity-90"
                                            />
                                        )}
                                    </div>

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

                                    {showHeartAnimation === reel.id && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                            <Heart className="h-24 w-24 text-white fill-white animate-ping" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                        className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
                                    >
                                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </button>

                                    <div className={cn(
                                        "absolute left-0 bottom-0 w-[70%] p-4 pb-2 md:pb-4 text-white z-10",
                                        reel.orientation === 'landscape' && "hidden md:block"
                                    )}>
                                        <div className="mb-2">
                                            <Link href={`/umkm/${reel.umkmId}`} className="text-base font-bold drop-shadow-md hover:underline cursor-pointer">
                                                @{reel.umkmName.replace(/\s+/g, '').toLowerCase()}
                                            </Link>
                                            <p className={cn("text-sm drop-shadow-md opacity-90 mt-1", !isExpanded && "line-clamp-2")}>
                                                {description}
                                            </p>
                                            {description.length > 45 && (
                                                <button
                                                    onClick={() => toggleExpand(reel.id)}
                                                    className="text-gray-400 font-medium text-sm hover:underline mt-1"
                                                >
                                                    {isExpanded ? 'sembunyikan' : 'banyak'}
                                                </button>
                                            )}
                                        </div>
                                        {reel.distance && (
                                            <span className="inline-block px-2 py-1 bg-green-500/80 rounded-full text-xs font-medium">
                                                📍 {reel.distance}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Actions */}
                                <div className="hidden md:flex flex-col gap-4 items-center justify-end h-[95%] pb-10 ml-8">
                                    <Link href={`/umkm/${reel.umkmId}`} className="relative mb-2 cursor-pointer group">
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

                                    <WhatsAppButton
                                        reelId={reel.id}
                                        umkmName={reel.umkmName}
                                        whatsappLink={reel.whatsappLink}
                                        productName={reel.product}
                                        onTrack={() => trackEngagement(reel.id, 'click_wa')}
                                    />

                                    <ActionButton icon={Share2} label="Bagikan" onClick={() => handleShare(reel)} />

                                    <div className="mt-12 flex flex-col gap-2">
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

                                {/* Mobile Actions */}
                                <div className={cn(
                                    "absolute right-2 bottom-24 flex flex-col items-center gap-4 md:hidden z-20",
                                    reel.orientation === 'landscape' && "translate-y-1/3"
                                )}>
                                    <Link href={`/umkm/${reel.umkmId}`} className="relative">
                                        <div className="h-12 w-12 rounded-full border border-white p-0.5">
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

                                    <WhatsAppButton
                                        overlay
                                        reelId={reel.id}
                                        umkmName={reel.umkmName}
                                        whatsappLink={reel.whatsappLink}
                                        productName={reel.product}
                                        onTrack={() => trackEngagement(reel.id, 'click_wa')}
                                    />

                                    <ActionButton icon={Share2} label="Bagikan" color="text-white" overlay onClick={() => handleShare(reel)} />
                                </div>

                                <div className="absolute top-4 right-4 z-20 md:hidden">
                                    <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-all active:scale-95">
                                        <Search className="h-6 w-6" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}

            {/* Loading Indicator for Infinite Scroll */}
            <div
                ref={loadMoreRef}
                className="flex items-center justify-center h-20 w-full snap-center"
            >
                {isLoadingMore && (
                    <div className="flex items-center gap-2 text-white">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        <span className="text-sm">Memuat lebih banyak...</span>
                    </div>
                )}
                {!hasMore && showEndMessage && (
                    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
                        <p className="text-black dark:text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">
                            Sudah mencapai akhir
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// WhatsApp Button Component with Animation
function WhatsAppButton({
    overlay = false,
    reelId,
    umkmName,
    whatsappLink,
    productName,
    onTrack
}: {
    overlay?: boolean;
    reelId?: number;
    umkmName?: string;
    whatsappLink?: string;
    productName?: string;
    onTrack?: () => void;
}) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 300);

        // Track WhatsApp CTA click
        onTrack?.();

        // Open WhatsApp link from API
        if (whatsappLink) {
            window.open(whatsappLink, '_blank');
        }
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
        onClick?.();
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200);
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
