import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { Eye, MessageCircle, Video, Heart, Loader2, TrendingUp, Store, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EngagementController from '@/actions/App/Http/Controllers/Engagement/EngagementController';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Seller Dashboard', href: '/seller' },
];

interface Stats {
    summary: {
        total_views: number;
        total_likes: number;
        total_shares: number;
        total_click_wa: number;
    };
    reels: Array<{
        id: number;
        product_name: string;
        views: number;
        likes: number;
        shares: number;
        click_wa: number;
    }>;
}

export default function SellerDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [totalReels, setTotalReels] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch engagement stats
            const statsResponse = await fetch(EngagementController.sellerStats.url(), {
                credentials: 'include',
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData.data);
            }

            // Fetch reels count
            const reelsResponse = await fetch(ReelsController.sellerReels.url({ query: { per_page: '1' } }), {
                credentials: 'include',
            });

            if (reelsResponse.ok) {
                const reelsData = await reelsResponse.json();
                setTotalReels(reelsData.meta?.total || 0);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Gagal memuat statistik');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Store className="h-7 w-7 text-umkm-orange" />
                                Seller Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Pantau performa konten dan engagement toko Anda
                            </p>
                        </div>
                        <Button asChild className="bg-umkm-orange hover:bg-umkm-orange-dark">
                            <Link href="/upload" className="inline-flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Upload Konten
                            </Link>
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 text-umkm-orange animate-spin" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat statistik...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                            <button onClick={fetchStats} className="px-4 py-2 bg-umkm-orange text-white rounded-lg hover:bg-umkm-orange-dark">
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                <div className="rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 p-5 dark:from-teal-900/30 dark:to-teal-800/20 border border-teal-200 dark:border-teal-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <Eye className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                        <TrendingUp className="h-4 w-4 text-teal-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                                        {(stats?.summary.total_views || 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">Total Views</div>
                                </div>

                                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                                        {(stats?.summary.total_click_wa || 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">WhatsApp Clicks</div>
                                </div>

                                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        <TrendingUp className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                        {totalReels.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Videos</div>
                                </div>

                                <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-5 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <Heart className="h-6 w-6 text-red-500 dark:text-red-400" />
                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-red-600 dark:text-red-300">
                                        {(stats?.summary.total_likes || 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-red-500 dark:text-red-400 font-medium">Total Likes</div>
                                </div>
                            </div>

                            {/* Reels Performance Table */}
                            {stats?.reels && stats.reels.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Performa Konten
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Produk</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Views</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Likes</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Shares</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">WA Clicks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.reels.map((reel) => (
                                                    <tr key={reel.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="py-3 px-2 text-gray-900 dark:text-white">{reel.product_name}</td>
                                                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{reel.views.toLocaleString()}</td>
                                                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{reel.likes.toLocaleString()}</td>
                                                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{reel.shares.toLocaleString()}</td>
                                                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{reel.click_wa.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild variant="outline">
                                    <Link href="/seller/content">
                                        <Video className="h-4 w-4 mr-2" />
                                        Kelola Konten
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/seller/profile">
                                        <Store className="h-4 w-4 mr-2" />
                                        Edit Profil Toko
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
