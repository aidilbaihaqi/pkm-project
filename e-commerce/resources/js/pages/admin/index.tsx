import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { Users, Store, Video, Loader2, ShieldCheck, ShieldX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminController from '@/actions/App/Http/Controllers/Admin/AdminController';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
];

interface Stats {
    total_users: number;
    total_sellers: number;
    total_reels: number;
    blocked_sellers: number;
}

interface Seller {
    id: number;
    name: string;
    email: string;
    umkm_name: string | null;
    reels_count: number;
    is_blocked: boolean;
    created_at: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
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

            // Fetch sellers
            const sellersResponse = await fetch(AdminController.sellers.url(), {
                credentials: 'include',
            });

            if (sellersResponse.ok) {
                const sellersData = await sellersResponse.json();
                setSellers(sellersData.data || []);
            }
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBlockSeller = async (sellerId: number) => {
        try {
            setActionLoading(sellerId);

            const response = await fetch(AdminController.blockSeller.url(sellerId), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
                    ),
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
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
                    ),
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
                        <Button onClick={fetchData} variant="outline" size="sm" disabled={isLoading}>
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
                            <Button onClick={fetchData} className="bg-umkm-orange hover:bg-umkm-orange-dark">
                                Coba Lagi
                            </Button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users className="h-5 w-5 text-umkm-orange" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                                    </div>
                                    <div className="text-2xl font-bold text-umkm-orange">
                                        {(stats?.total_users || 0).toLocaleString()}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Store className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Sellers</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {(stats?.total_sellers || 0).toLocaleString()}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Video className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Content</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {(stats?.total_reels || 0).toLocaleString()}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <ShieldX className="h-5 w-5 text-red-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Blocked Sellers</span>
                                    </div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {(stats?.blocked_sellers || 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Sellers Table */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Daftar Seller
                                </h2>
                                {sellers.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Nama</th>
                                                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Email</th>
                                                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">UMKM</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Reels</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                                                    <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sellers.map((seller) => (
                                                    <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="py-3 px-2 text-gray-900 dark:text-white">{seller.name}</td>
                                                        <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{seller.email}</td>
                                                        <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{seller.umkm_name || '-'}</td>
                                                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{seller.reels_count}</td>
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
