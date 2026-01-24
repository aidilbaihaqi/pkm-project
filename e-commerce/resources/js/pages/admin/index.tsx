import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2, Layers, BarChart2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminController from '@/actions/App/Http/Controllers/Admin/AdminController';

// Types & Utils
import { Stats, Seller, PaginationMeta, Category, ModerationReel } from './types';
import { transformSeller, getCsrfToken } from './utils';

// Components
import { DashboardStats } from './components/DashboardStats';
import { SellersView } from './components/SellersView';
import { CategoriesView } from './components/CategoriesView';
import { ModerationView } from './components/ModerationView';
import { PlaceholderView } from './components/PlaceholderView';
import { AdvancedStatsView } from './components/AdvancedStatsView';

export default function AdminDashboard({ view }: { view?: string }) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [reels, setReels] = useState<ModerationReel[]>([]);
    const [trendData, setTrendData] = useState<any>(null);

    // Reset pagination when view changes
    useEffect(() => {
        setCurrentPage(1);
    }, [view]);

    const fetchData = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!view || view === 'dashboard') {
                // Fetch stats
                const statsResponse = await fetch(AdminController.stats.url(), {
                    credentials: 'include',
                });
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData.data);
                }
                // Fetch sellers for preview
                const sellersResponse = await fetch(
                    AdminController.sellers.url({ query: { page: '1', per_page: '5' } }),
                    { credentials: 'include' }
                );
                if (sellersResponse.ok) {
                    const sellersData = await sellersResponse.json();
                    setSellers((sellersData.data || []).map(transformSeller));
                }
            } else if (view === 'sellers') {
                // Fetch sellers
                const sellersResponse = await fetch(
                    AdminController.sellers.url({ query: { page: page.toString(), per_page: '10' } }),
                    { credentials: 'include' }
                );
                if (sellersResponse.ok) {
                    const sellersData = await sellersResponse.json();
                    setSellers((sellersData.data || []).map(transformSeller));
                    setMeta(sellersData.meta);
                }
            } else if (view === 'categories') {
                const catResponse = await fetch('/api/admin/categories', { credentials: 'include' });
                if (catResponse.ok) {
                    const catData = await catResponse.json();
                    setCategories(catData.data);
                }
            } else if (view === 'stats') {
                const statsResponse = await fetch(AdminController.stats.url(), { credentials: 'include' });
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData.data);
                }
                // Fetch trend data for charts
                const trendResponse = await fetch('/api/admin/trend-stats', { credentials: 'include' });
                if (trendResponse.ok) {
                    const trendResult = await trendResponse.json();
                    setTrendData(trendResult.data);
                }
            } else if (view === 'moderation') {
                const modResponse = await fetch(`/api/admin/moderation?page=${page}`, { credentials: 'include' });
                if (modResponse.ok) {
                    const modData = await modResponse.json();
                    setReels(modData.data);
                    setMeta(modData.meta);
                }
            }

        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    }, [view]);

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

    const getPageTitle = () => {
        switch (view) {
            case 'sellers': return 'Manajemen Seller';
            case 'categories': return 'Kategori Konten';
            case 'stats': return 'Statistik';
            case 'moderation': return 'Moderasi Konten';
            default: return 'Admin Dashboard';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: getPageTitle(), href: '#' }]}>
            <Head title={getPageTitle()} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {view === 'sellers' && 'Kelola pendaftaran dan status seller'}
                                {view === 'categories' && 'Atur kategori video dan konten'}
                                {view === 'stats' && 'Analisis performa platform secara detail'}
                                {view === 'moderation' && 'Tinjau laporan pelanggaran konten'}
                                {!view && 'Ringkasan aktivitas platform UMKMku'}
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
                            {(!view || view === 'dashboard') && (
                                <DashboardStats
                                    stats={stats}
                                    sellers={sellers}
                                    meta={meta}
                                    isLoading={isLoading}
                                    formatNumber={formatNumber}
                                />
                            )}

                            {view === 'sellers' && (
                                <SellersView
                                    sellers={sellers}
                                    meta={meta}
                                    isLoading={isLoading}
                                    actionLoading={actionLoading}
                                    handleBlockSeller={handleBlockSeller}
                                    handleUnblockSeller={handleUnblockSeller}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    formatNumber={formatNumber}
                                />
                            )}

                            {view === 'categories' && (
                                <CategoriesView
                                    categories={categories}
                                    fetchCategories={() => fetchData(1)}
                                />
                            )}

                            {view === 'stats' && (
                                <AdvancedStatsView
                                    stats={stats}
                                    trendData={trendData}
                                    formatNumber={formatNumber}
                                />
                            )}

                            {view === 'moderation' && (
                                <ModerationView
                                    reels={reels}
                                    meta={meta}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    fetchReels={(p: number) => fetchData(p)}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
