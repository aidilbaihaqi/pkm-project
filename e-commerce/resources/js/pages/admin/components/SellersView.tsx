import { ShieldCheck, ShieldX, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seller, PaginationMeta } from '../types';

interface SellersTableProps {
    sellers: Seller[];
    meta: PaginationMeta | null;
    isLoading: boolean;
    actionLoading: number | null;
    onToggleBlock: ((id: number, blocked: boolean) => void) | null;
    formatNumber: (n: number) => string;
    showPagination?: boolean;
    currentPage?: number;
    setCurrentPage?: (p: any) => void;
}

export function RenderSellersTable({
    sellers,
    meta,
    isLoading,
    actionLoading,
    onToggleBlock,
    formatNumber,
    showPagination = true,
    currentPage,
    setCurrentPage
}: SellersTableProps) {
    if (sellers.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                Belum ada seller terdaftar
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Nama</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">UMKM</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Reels</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Views</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                            {onToggleBlock && <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                        {sellers.map((seller) => (
                            <tr key={seller.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{seller.name}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{seller.email}</td>
                                <td className="py-3 px-4">
                                    {seller.umkm_name ? (
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium">{seller.umkm_name}</p>
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
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                            <ShieldX className="h-3 w-3" />
                                            Blocked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                            <ShieldCheck className="h-3 w-3" />
                                            Active
                                        </span>
                                    )}
                                </td>
                                {onToggleBlock && (
                                    <td className="py-3 px-2 text-center">
                                        {seller.is_blocked ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onToggleBlock(seller.id, true)}
                                                disabled={actionLoading === seller.id}
                                                className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-900/30"
                                            >
                                                {actionLoading === seller.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    'Unblock'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onToggleBlock(seller.id, false)}
                                                disabled={actionLoading === seller.id}
                                                className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/30"
                                            >
                                                {actionLoading === seller.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    'Block'
                                                )}
                                            </Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && meta && meta.last_page > 1 && setCurrentPage && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Halaman {meta.current_page} dari {meta.last_page} ({meta.total} seller)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage((p: number) => Math.min(meta.last_page, p + 1))}
                            disabled={currentPage === meta.last_page || isLoading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export const SellersView = ({ sellers, meta, isLoading, actionLoading, handleBlockSeller, handleUnblockSeller, currentPage, setCurrentPage, formatNumber }: any) => (
    <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Manajemen Seller
        </h2>
        <RenderSellersTable
            sellers={sellers}
            meta={meta}
            isLoading={isLoading}
            actionLoading={actionLoading}
            onToggleBlock={(id: number, blocked: boolean) => blocked ? handleUnblockSeller(id) : handleBlockSeller(id)}
            formatNumber={formatNumber}
            showPagination={true}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    </div>
);
