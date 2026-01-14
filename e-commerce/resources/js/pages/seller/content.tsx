import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import {
    Play, Eye, Heart, MoreVertical, Edit, Trash2,
    PlusCircle, Filter, Grid, List, Clock, CheckCircle,
    AlertCircle, Youtube, Loader2, X, Image as ImageIcon
} from 'lucide-react';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';

// API Reel type
interface ApiReel {
    id: number;
    video_url: string | null;
    thumbnail_url: string | null;
    product_name: string;
    caption: string | null;
    price: string | null;
    kategori: string;
    type: 'video' | 'image';
    images: string[] | null;
    status: 'draft' | 'review' | 'published';
    created_at: string;
    updated_at: string;
    views_count?: number;
}

// Internal video type
interface VideoItem {
    id: number;
    title: string;
    youtubeId: string | null;
    thumbnailUrl: string | null;
    caption: string;
    category: string;
    status: 'published' | 'draft' | 'review';
    type: 'video' | 'image';
    images: string[];
    imageCount: number;
    views: number;
    likes: number;
    createdAt: string;
}

// Transform API response
function transformApiReel(apiReel: ApiReel): VideoItem {
    // Extract YouTube ID from URL
    let youtubeId: string | null = null;
    if (apiReel.video_url) {
        const match = apiReel.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
        youtubeId = match ? match[1] : null;
    }

    return {
        id: apiReel.id,
        title: apiReel.product_name,
        youtubeId,
        thumbnailUrl: apiReel.thumbnail_url,
        caption: apiReel.caption || '',
        category: apiReel.kategori,
        status: apiReel.status,
        type: apiReel.type,
        images: apiReel.images || [],
        imageCount: apiReel.images?.length || 0,
        views: apiReel.views_count || 0,
        likes: 0,
        createdAt: apiReel.created_at,
    };
}

const statusConfig = {
    published: { label: 'Tayang', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Clock },
    review: { label: 'Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: AlertCircle },
};

function VideoCard({ video, viewMode, onEdit, onDelete }: {
    video: VideoItem;
    viewMode: 'grid' | 'list';
    onEdit: (video: VideoItem) => void;
    onDelete: (video: VideoItem) => void;
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const status = statusConfig[video.status];
    const StatusIcon = status.icon;
    const thumbnail = video.thumbnailUrl || (video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg` : 'https://via.placeholder.com/320x180');
    const isVideo = video.type === 'video' && video.youtubeId;

    // Construct media items array
    const mediaItems: { type: 'video' | 'image', url: string }[] = [];
    if (isVideo) {
        mediaItems.push({ type: 'video', url: video.youtubeId as string });
    }
    if (video.images && video.images.length > 0) {
        video.images.forEach(img => mediaItems.push({ type: 'image', url: img }));
    } else if (!isVideo) {
        // Fallback or Image only without images array (shouldn't happen with new logic but good for safety)
        mediaItems.push({ type: 'image', url: thumbnail });
    }

    const hasMultipleSlides = mediaItems.length > 1;

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
        setIsPlaying(false);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentSlide((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
        setIsPlaying(false);
    };

    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 group">
                    {/* List view playback - optional, but helpful */}
                    {isPlaying && isVideo && currentSlide === 0 ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&hl=id`}
                            title={video.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <>
                            {/* Display current slide thumbnail */}
                            <img
                                src={mediaItems[currentSlide]?.type === 'video' ? thumbnail : mediaItems[currentSlide]?.url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />

                            {mediaItems[currentSlide]?.type === 'video' && (
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                                >
                                    <Play className="h-6 w-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                                </button>
                            )}

                            {hasMultipleSlides && (
                                <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/60 px-1 py-0.5 rounded text-[10px] text-white z-10">
                                    <ImageIcon className="h-3 w-3" />
                                    <span>{mediaItems.length}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{video.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{video.caption}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                        </span>
                        <span className="text-xs text-gray-400">{video.category}</span>
                        {hasMultipleSlides && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <ImageIcon className="h-3 w-3" />
                                {mediaItems.length} items
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {video.likes.toLocaleString()}
                    </span>
                </div>
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                            <button onClick={() => { onEdit(video); setShowMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                                Ubah
                            </button>
                            <button onClick={() => { onDelete(video); setShowMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Trash2 className="h-4 w-4" />
                                Hapus
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                {mediaItems[currentSlide]?.type === 'video' && isPlaying ? (
                    <div className="w-full h-full relative">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&hl=id`}
                            title={video.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <img
                            src={mediaItems[currentSlide]?.type === 'video' ? thumbnail : mediaItems[currentSlide]?.url}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500"
                        />

                        {mediaItems[currentSlide]?.type === 'video' ? (
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group-hover:opacity-100"
                            >
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/50">
                                    <Play className="h-8 w-8 text-white fill-white" />
                                </div>
                            </button>
                        ) : (
                            // Image indicator if it's an image slide
                            <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                        )}

                        <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                        </span>

                        {/* Navigation Arrows */}
                        {hasMultipleSlides && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {mediaItems.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{video.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{video.caption}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {video.likes.toLocaleString()}
                        </span>
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 bottom-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button onClick={() => { onEdit(video); setShowMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button onClick={() => { onDelete(video); setShowMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Content() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<VideoItem | null>(null);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get CSRF token
    const getCsrfToken = (): string => {
        const name = 'XSRF-TOKEN=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length);
            }
        }
        return '';
    };

    // Fetch videos from API
    const fetchVideos = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                ReelsController.sellerReels.url({ query: { page: page.toString(), per_page: itemsPerPage.toString() } }),
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            setVideos((data.data || []).map(transformApiReel));
            setMeta(data.meta);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Gagal memuat konten. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        fetchVideos(currentPage);
    }, [fetchVideos, currentPage]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleEdit = (video: VideoItem) => {
        // Navigate to edit page
        router.visit(`/seller/content/${video.id}/edit`);
    };

    const handleDelete = (video: VideoItem) => {
        setDeleteConfirm(video);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            setIsDeleting(true);
            const response = await fetch(ReelsController.destroy.url({ reel: deleteConfirm.id }), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete video');
            }

            showToast('Video berhasil dihapus!', 'success');
            setDeleteConfirm(null);
            fetchVideos(currentPage);
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Gagal menghapus video', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredVideos = statusFilter === 'all'
        ? videos
        : videos.filter(v => v.status === statusFilter);

    const totalPages = meta?.last_page || 1;

    const handleFilterChange = (filter: string) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    const stats = {
        total: meta?.total || videos.length,
        published: videos.filter(v => v.status === 'published').length,
        totalViews: videos.reduce((sum, v) => sum + v.views, 0),
        totalLikes: videos.reduce((sum, v) => sum + v.likes, 0),
    };

    return (
        <AppLayout>
            <Head title="Manajemen Konten" />

            <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Konten Saya</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola video produk UMKM-mu</p>
                    </div>
                    <Button asChild className="bg-umkm-orange hover:bg-umkm-orange-dark">
                        <Link href="/upload" className="inline-flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Upload Konten
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Video</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tayang</p>
                        <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Likes</p>
                        <p className="text-2xl font-bold text-red-500">{stats.totalLikes.toLocaleString()}</p>
                    </div>
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
                        <button onClick={() => fetchVideos(currentPage)} className="px-4 py-2 bg-umkm-orange text-white rounded-lg hover:bg-umkm-orange-dark">
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {/* Filters & View Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <div className="flex gap-2">
                                    {['all', 'published', 'draft', 'review'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleFilterChange(status)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status
                                                ? 'bg-umkm-orange text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {status === 'all' ? 'Semua' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}>
                                    <Grid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}>
                                    <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Video List/Grid */}
                        {filteredVideos.length > 0 ? (
                            <>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                                    {filteredVideos.map((video) => (
                                        <VideoCard key={video.id} video={video} viewMode={viewMode} onEdit={handleEdit} onDelete={handleDelete} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span>Tampilkan</span>
                                            <select
                                                value={itemsPerPage}
                                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            >
                                                <option value={6}>6</option>
                                                <option value={12}>12</option>
                                                <option value={24}>24</option>
                                            </select>
                                            <span>per halaman</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Halaman {currentPage} dari {totalPages}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Sebelumnya
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Berikutnya
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Youtube className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada video</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">Upload video pertamamu sekarang!</p>
                                <Button asChild className="bg-umkm-orange hover:bg-umkm-orange-dark">
                                    <Link href="/upload">Upload Video</Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hapus Video?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Video "<span className="font-medium text-gray-700 dark:text-gray-300">{deleteConfirm.title}</span>" akan dihapus permanen.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
                                    Batal
                                </Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-700">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white min-w-[280px] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
