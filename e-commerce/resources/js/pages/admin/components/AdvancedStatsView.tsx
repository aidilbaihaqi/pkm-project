import { useState, useEffect } from 'react';
import { Users, Store, Video, Eye, Heart, TrendingUp, Award } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Stats } from '../types';

interface DailyEngagement {
    date: string;
    views: number;
    likes: number;
    shares: number;
    wa_clicks: number;
}

interface TopSeller {
    id: number;
    name: string;
    umkm_name: string;
    views: number;
    likes: number;
    reels_count: number;
}

interface ContentGrowth {
    date: string;
    count: number;
}

interface TrendData {
    daily_engagement: DailyEngagement[];
    top_sellers: TopSeller[];
    content_growth: ContentGrowth[];
}

interface AdvancedStatsViewProps {
    stats: Stats | null;
    trendData: TrendData | null;
    formatNumber: (n: number) => string;
}

export const AdvancedStatsView = ({ stats, trendData, formatNumber }: AdvancedStatsViewProps) => {
    // Derived Metrics
    const avgViews = stats?.total_reels ? (stats.engagement.total_views / stats.total_reels) : 0;
    const avgLikes = stats?.total_reels ? (stats.engagement.total_likes / stats.total_reels) : 0;
    const engagementRate = stats?.engagement.total_views ? ((stats.engagement.total_likes + stats.engagement.total_shares) / stats.engagement.total_views) * 100 : 0;
    const conversionRate = stats?.engagement.total_views ? (stats.engagement.total_click_wa / stats.engagement.total_views) * 100 : 0;

    // Format date for chart
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const chartData = trendData?.daily_engagement?.map(d => ({
        ...d,
        date: formatDate(d.date),
    })) || [];

    return (
        <div className="space-y-8">
            {/* Derived Metrics Cards */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Metrik Performa
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Views per Video</p>
                        <p className="text-2xl font-bold text-blue-600">{avgViews.toFixed(1)}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Likes per Video</p>
                        <p className="text-2xl font-bold text-pink-600">{avgLikes.toFixed(1)}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                        <p className="text-2xl font-bold text-violet-600">{engagementRate.toFixed(2)}%</p>
                        <p className="text-xs text-gray-400">(Likes + Shares) / Views</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                        <p className="text-2xl font-bold text-emerald-600">{conversionRate.toFixed(2)}%</p>
                        <p className="text-xs text-gray-400">WA Clicks / Views</p>
                    </div>
                </div>
            </div>

            {/* Engagement Trend Chart */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-500" />
                    Tren Engagement (7 Hari Terakhir)
                </h2>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#8b5cf6"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    name="Views"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="likes"
                                    stroke="#ec4899"
                                    fillOpacity={1}
                                    fill="url(#colorLikes)"
                                    name="Likes"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                            Belum ada data engagement dalam 7 hari terakhir
                        </div>
                    )}
                </div>
            </div>

            {/* Top Sellers */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Top 5 Seller (Berdasarkan Views)
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">#</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">UMKM</th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Videos</th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Views</th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Likes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900">
                            {trendData?.top_sellers?.length ? (
                                trendData.top_sellers.map((seller, index) => (
                                    <tr key={seller.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-gray-200 text-gray-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-900 dark:text-white">{seller.umkm_name}</p>
                                            <p className="text-xs text-gray-500">{seller.name}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{seller.reels_count}</td>
                                        <td className="py-3 px-4 text-center font-semibold text-purple-600">{formatNumber(seller.views)}</td>
                                        <td className="py-3 px-4 text-center font-semibold text-pink-600">{formatNumber(seller.likes)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        Belum ada data seller
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
