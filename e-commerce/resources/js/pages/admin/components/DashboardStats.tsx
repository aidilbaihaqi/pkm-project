import { Users, Store, Video, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import { Stats, Seller, PaginationMeta } from '../types';
import { RenderSellersTable } from './SellersView';

interface DashboardStatsProps {
    stats: Stats | null;
    sellers: Seller[];
    meta: PaginationMeta | null;
    isLoading: boolean;
    formatNumber: (n: number) => string;
    variant?: 'dashboard' | 'stats';
}

export const DashboardStats = ({ stats, sellers, meta, isLoading, formatNumber, variant = 'dashboard' }: DashboardStatsProps) => {
    // Derived Metrics for detailed stats
    const avgViews = stats?.total_reels ? (stats.engagement.total_views / stats.total_reels) : 0;
    const avgLikes = stats?.total_reels ? (stats.engagement.total_likes / stats.total_reels) : 0;
    const engagementRate = stats?.engagement.total_views ? ((stats.engagement.total_likes + stats.engagement.total_shares) / stats.engagement.total_views) * 100 : 0;
    const conversionRate = stats?.engagement.total_views ? (stats.engagement.total_click_wa / stats.engagement.total_views) * 100 : 0;

    return (
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

            {/* Detailed Analysis (Only for 'stats' variant) */}
            {variant === 'stats' && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Metrik Performa (Rata-rata)
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Views per Video</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{avgViews.toFixed(1)}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Likes per Video</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{avgLikes.toFixed(1)}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</p>
                            <p className="text-xl font-bold text-indigo-600">{engagementRate.toFixed(2)}%</p>
                            <p className="text-xs text-gray-400">((Likes + Shares) / Views)</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                            <p className="text-xl font-bold text-green-600">{conversionRate.toFixed(2)}%</p>
                            <p className="text-xs text-gray-400">(WA Clicks / Views)</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Sellers Preview (First 5) - Only for dashboard variant */}
            {variant === 'dashboard' && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Seller Terbaru
                    </h2>
                    <RenderSellersTable
                        sellers={sellers.slice(0, 5)}
                        meta={null}
                        isLoading={isLoading}
                        actionLoading={null}
                        onToggleBlock={null}
                        formatNumber={formatNumber}
                        showPagination={false}
                    />
                </div>
            )}
        </>
    );
};
