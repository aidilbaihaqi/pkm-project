import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Play, Eye, Heart, MoreVertical, Edit, Trash2,
    PlusCircle, Filter, Grid, List, Clock, CheckCircle,
    AlertCircle, Youtube
} from 'lucide-react';

// Mock data - akan diganti dengan data dari API
const mockVideos = [
    {
        id: 1,
        title: 'Gudeg Spesial Bu Tini',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Menikmati gudeg spesial dengan cita rasa asli Jogja #kuliner #umkm',
        category: 'Kuliner',
        status: 'published',
        views: 1250,
        likes: 234,
        createdAt: '2024-12-15',
    },
    {
        id: 2,
        title: 'Batik Tulis Motif Baru',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Koleksi batik tulis terbaru dengan motif modern #fashion #batik',
        category: 'Fashion',
        status: 'published',
        views: 856,
        likes: 189,
        createdAt: '2024-12-14',
    },
    {
        id: 3,
        title: 'Kerajinan Rotan Handmade',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Tas rotan handmade berkualitas tinggi #kerajinan #handmade',
        category: 'Kerajinan',
        status: 'draft',
        views: 0,
        likes: 0,
        createdAt: '2024-12-16',
    },
    {
        id: 4,
        title: 'Kopi Susu Gula Aren',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Kopi susu dengan gula aren asli #kopi #minuman',
        category: 'Kuliner',
        status: 'review',
        views: 0,
        likes: 0,
        createdAt: '2024-12-16',
    },
    {
        id: 5,
        title: 'Sambal Matah Khas Bali',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Sambal matah fresh langsung dari Bali #kuliner #sambal',
        category: 'Kuliner',
        status: 'published',
        views: 2340,
        likes: 456,
        createdAt: '2024-12-13',
    },
    {
        id: 6,
        title: 'Tenun Ikat NTT Premium',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Kain tenun ikat asli NTT dengan motif tradisional #fashion #tenun',
        category: 'Fashion',
        status: 'published',
        views: 1890,
        likes: 321,
        createdAt: '2024-12-12',
    },
    {
        id: 7,
        title: 'Ukiran Kayu Jepara',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Ukiran kayu jati asli Jepara berkualitas ekspor #kerajinan #ukiran',
        category: 'Kerajinan',
        status: 'published',
        views: 987,
        likes: 167,
        createdAt: '2024-12-11',
    },
    {
        id: 8,
        title: 'Skincare Alami Herbal',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Skincare dari bahan alami Indonesia #kecantikan #skincare',
        category: 'Kecantikan',
        status: 'draft',
        views: 0,
        likes: 0,
        createdAt: '2024-12-16',
    },
    {
        id: 9,
        title: 'Madu Hutan Kalimantan',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Madu hutan asli dari pedalaman Kalimantan #pertanian #madu',
        category: 'Pertanian',
        status: 'published',
        views: 1567,
        likes: 289,
        createdAt: '2024-12-10',
    },
    {
        id: 10,
        title: 'Rendang Padang Premium',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Rendang asli Padang dengan resep turun temurun #kuliner #rendang',
        category: 'Kuliner',
        status: 'review',
        views: 0,
        likes: 0,
        createdAt: '2024-12-16',
    },
    {
        id: 11,
        title: 'Perhiasan Perak Kotagede',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Perhiasan perak handmade dari Kotagede Yogyakarta #kerajinan #perak',
        category: 'Kerajinan',
        status: 'published',
        views: 765,
        likes: 134,
        createdAt: '2024-12-09',
    },
    {
        id: 12,
        title: 'Kopi Toraja Arabica',
        youtubeId: 'dQw4w9WgXcQ',
        caption: 'Kopi arabica premium dari dataran tinggi Toraja #kuliner #kopi',
        category: 'Kuliner',
        status: 'published',
        views: 2100,
        likes: 398,
        createdAt: '2024-12-08',
    },
];

const statusConfig = {
    published: { label: 'Tayang', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Clock },
    review: { label: 'Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: AlertCircle },
};

function VideoCard({ video, viewMode }: { video: typeof mockVideos[0]; viewMode: 'grid' | 'list' }) {
    const [showMenu, setShowMenu] = useState(false);
    const status = statusConfig[video.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;

    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{video.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{video.caption}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                        </span>
                        <span className="text-xs text-gray-400">{video.category}</span>
                    </div>
                </div>

                {/* Stats */}
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

                {/* Actions */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Play className="h-10 w-10 text-white" />
                </div>
                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                </span>
            </div>

            {/* Info */}
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
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 bottom-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700">
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

    const filteredVideos = statusFilter === 'all'
        ? mockVideos
        : mockVideos.filter(v => v.status === statusFilter);

    // Pagination logic
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filter changes
    const handleFilterChange = (filter: string) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    const stats = {
        total: mockVideos.length,
        published: mockVideos.filter(v => v.status === 'published').length,
        totalViews: mockVideos.reduce((sum, v) => sum + v.views, 0),
        totalLikes: mockVideos.reduce((sum, v) => sum + v.likes, 0),
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
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                        >
                            <Grid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                        >
                            <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Video List/Grid */}
                {paginatedVideos.length > 0 ? (
                    <>
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'space-y-3'
                        }>
                            {paginatedVideos.map((video) => (
                                <VideoCard key={video.id} video={video} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {/* Items per page */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Tampilkan</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value={6}>6</option>
                                        <option value={12}>12</option>
                                        <option value={24}>24</option>
                                    </select>
                                    <span>per halaman</span>
                                </div>

                                {/* Page info & navigation */}
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
                                            Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-umkm-orange text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
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
            </div>
        </AppLayout>
    );
}
