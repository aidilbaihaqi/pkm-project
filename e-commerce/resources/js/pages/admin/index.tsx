import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { Users, Store, Video, Loader2, ShieldCheck, ShieldX, RefreshCw, Eye, Heart, Share2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminController from '@/actions/App/Http/Controllers/Admin/AdminController';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
];

interface Stats {
    total_users: number;
    total_sellers: number;
    total_reels: number;
    engagement: {
        total_views: number;
        total_likes: number;
        total_shares: number;
        total_click_wa: number;
    };
}

interface ApiSeller {
    id: number;
    name: string;
    email: string;
    umkm_profile?: {
        id: number;
        nama_toko: string;
        kategori: string;
        is_blocked: boolean;
        reels_count?: number;
    } | null;
    statistics?: {
        total_views: number;
        total_likes: number;
        total_shares: number;
        total_click_wa: number;
    };
}

interface Seller {
    id: number;
    name: string;
    email: string;
    umkm_name: string | null;
    kategori: string | null;
    reels_count: number;
    is_blocked: boolean;
    stats: {
        views: number;
        likes: number;
        shares: number;
        wa_clicks: number;
    };
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Transform API seller to frontend format
function transformSeller(apiSeller: ApiSeller): Seller {
    return {
        id: apiSeller.id,
        name: apiSeller.name,
        email: apiSeller.email,
        umkm_name: apiSeller.umkm_profile?.nama_toko || null,
        kategori: apiSeller.umkm_profile?.kategori || null,
        reels_count: apiSeller.umkm_profile?.reels_count || 0,
        is_blocked: apiSeller.umkm_profile?.is_blocked || false,
        stats: {
            views: apiSeller.statistics?.total_views || 0,
            likes: apiSeller.statistics?.total_likes || 0,
            shares: apiSeller.statistics?.total_shares || 0,
            wa_clicks: apiSeller.statistics?.total_click_wa || 0,
        },
    };
}

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

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch stats
            const statsResponse = await fetch(AdminController.stats.url(), {
                credentials: 'include',
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData.data);
            }

            // Fetch sellers with pagination
            const sellersResponse = await fetch(
                AdminController.sellers.url({ query: { page: page.toString(), per_page: '10' } }),
                { credentials: 'include' }
            );

            if (sellersResponse.ok) {
                const sellersData = await sellersResponse.json();
                const transformedSellers = (sellersData.data || []).map(transformSeller);
                setSellers(transformedSellers);
                setMeta(sellersData.meta);
            }
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(currentPage);
    }, [fetchData, currentPage]);

    const handleBlockSeller = async (sellerId: number) => {
        try {
            setActionLoading(sellerId);

            const response = await fetch(AdminController.blockSeller.url(sellerId), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            });

            if (response.ok) {
                setSellers(prev => prev.map(seller =>
                    seller.id === sellerId ? { ...seller, is_blocked: true } : seller
                ));
            }
        } catch (err) {
            console.error('Error blocking seller:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnblockSeller = async (sellerId: number) => {
        try {
            setActionLoading(sellerId);

            const response = await fetch(AdminController.unblockSeller.url(sellerId), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            });

            if (response.ok) {
                setSellers(prev => prev.map(seller =>
                    seller.id === sellerId ? { ...seller, is_blocked: false } : seller
                ));
            }
        } catch (err) {
            console.error('Error unblocking seller:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ⚙️ Admin Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Panel administrasi untuk mengelola platform UMKMku
                            </p>
                        </div>
                        <Button onClick={() => fetchData(currentPage)} variant="outline" size="sm" disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 text-umkm-orange animate-spin" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                            <Button onClick={() => fetchData(currentPage)} className="bg-umkm-orange hover:bg-umkm-orange-dark">
                                Coba Lagi
                            </Button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {/* Platform Stats */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users className="h-5 w-5 text-umkm-orange" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                                    </div>
                                    <div className="text-2xl font-bold text-umkm-orange">
                                        {formatNumber(stats?.total_users || 0)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Store className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Sellers</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatNumber(stats?.total_sellers || 0)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Video className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Content</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatNumber(stats?.total_reels || 0)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Eye className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {formatNumber(stats?.engagement?.total_views || 0)}
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Stats */}
                            <div className="grid gap-4 sm:grid-cols-3 mb-8">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Likes</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(stats?.engagement?.total_likes || 0)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Share2 className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Shares</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(stats?.engagement?.total_shares || 0)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <MessageCircle className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp Clicks</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatNumber(stats?.engagement?.total_click_wa || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sellers Table */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Daftar Seller ({meta?.total || sellers.length})
                                </h2>
                                {sellers.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Nama</th>
                                                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Email</th>
                                                        <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">UMKM</th>
                                                        <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Reels</th>
                                                        <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Views</th>
                                                        <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                                                        <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sellers.map((seller) => (
                                                        <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                            <td className="py-3 px-2 text-gray-900 dark:text-white">{seller.name}</td>
                                                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{seller.email}</td>
                                                            <td className="py-3 px-2">
                                                                {seller.umkm_name ? (
                                                                    <div>
                                                                        <p className="text-gray-900 dark:text-white">{seller.umkm_name}</p>
                                                                        {seller.kategori && (
                                                                            <p className="text-xs text-gray-500">{seller.kategori}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{seller.reels_count}</td>
                                                            <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                                                                {formatNumber(seller.stats.views)}
                                                            </td>
                                                            <td className="py-3 px-2 text-center">
                                                                {seller.is_blocked ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                                        <ShieldX className="h-3 w-3" />
                                                                        Blocked
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        <ShieldCheck className="h-3 w-3" />
                                                                        Active
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-2 text-center">
                                                                {seller.is_blocked ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleUnblockSeller(seller.id)}
                                                                        disabled={actionLoading === seller.id}
                                                                        className="text-green-600 border-green-300 hover:bg-green-50"
                                                                    >
                                                                        {actionLoading === seller.id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            'Unblock'
                                                                        )}
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleBlockSeller(seller.id)}
                                                                        disabled={actionLoading === seller.id}
                                                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                                                    >
                                                                        {actionLoading === seller.id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            'Block'
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {meta && meta.last_page > 1 && (
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Halaman {meta.current_page} dari {meta.last_page} ({meta.total} seller)
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1 || isLoading}
                                                    >
                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                        Prev
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                                                        disabled={currentPage === meta.last_page || isLoading}
                                                    >
                                                        Next
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        Belum ada seller terdaftar
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
