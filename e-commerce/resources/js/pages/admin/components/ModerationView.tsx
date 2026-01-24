import { ShieldX, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight, Loader2, Eye, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModerationReel, PaginationMeta } from '../types';
import { getCsrfToken } from '../utils';
import { useState } from 'react';

interface ModerationViewProps {
    reels: ModerationReel[];
    fetchReels: (page: number) => void;
    meta: PaginationMeta | null;
    currentPage: number;
    setCurrentPage: (page: any) => void;
}

export const ModerationView = ({ reels, fetchReels, meta, currentPage, setCurrentPage }: ModerationViewProps) => {
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [blockReason, setBlockReason] = useState<string>('');
    const [showReasonModal, setShowReasonModal] = useState<number | null>(null);
    const [showImageModal, setShowImageModal] = useState<string | null>(null);

    const blockedCount = reels.filter(r => r.is_blocked).length;
    const activeCount = reels.filter(r => !r.is_blocked).length;

    const handleBlock = async (id: number, reason?: string) => {
        setActionLoading(id);
        try {
            await fetch(`/api/admin/moderation/${id}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ reason: reason || 'Melanggar kebijakan konten' }),
            });
            fetchReels(currentPage);
            setShowReasonModal(null);
            setBlockReason('');
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnblock = async (id: number) => {
        setActionLoading(id);
        try {
            await fetch(`/api/admin/moderation/${id}/unblock`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            });
            fetchReels(currentPage);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus konten ini secara permanen?')) return;
        setActionLoading(id);
        try {
            await fetch(`/api/admin/moderation/${id}`, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            });
            fetchReels(currentPage);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            {/* Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Konten</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {meta?.total || reels.length}
                    </div>
                </div>

                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Konten Aktif</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {activeCount}
                    </div>
                </div>

                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Konten Diblokir</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                        {blockedCount}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Thumbnail</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Produk</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Toko</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Tipe</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Tanggal</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                        {reels.map((reel) => (
                            <tr key={reel.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                {/* Thumbnail */}
                                <td className="py-3 px-4">
                                    <div 
                                        className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setShowImageModal(reel.thumbnail_url)}
                                    >
                                        <img 
                                            src={reel.thumbnail_url} 
                                            alt={reel.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>

                                {/* Product Info */}
                                <td className="py-3 px-4">
                                    <div className="max-w-xs">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {reel.product_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                            {reel.caption}
                                        </p>
                                        {reel.is_blocked && reel.blocked_reason && (
                                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
                                                <span className="font-semibold">Alasan: </span>
                                                {reel.blocked_reason}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Store */}
                                <td className="py-3 px-4">
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {reel.umkm_profile?.nama_toko || '-'}
                                    </p>
                                </td>

                                {/* Type */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        {reel.video_url ? (
                                            <>
                                                <Video className="h-4 w-4 text-blue-500" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Video</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="h-4 w-4 text-green-500" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Image</span>
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="py-3 px-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {formatDate(reel.created_at)}
                                    </p>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4 text-center">
                                    {reel.is_blocked ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                            <ShieldAlert className="h-3 w-3" />
                                            Blocked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                            <ShieldCheck className="h-3 w-3" />
                                            Active
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {reel.is_blocked ? (
                                            <Button 
                                                onClick={() => handleUnblock(reel.id)} 
                                                size="sm" 
                                                variant="outline"
                                                className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-900/30"
                                                disabled={actionLoading === reel.id}
                                            >
                                                {actionLoading === reel.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                                        Unblock
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => setShowReasonModal(reel.id)} 
                                                size="sm" 
                                                variant="outline"
                                                className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/30"
                                                disabled={actionLoading === reel.id}
                                            >
                                                {actionLoading === reel.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                                                        Block
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            onClick={() => handleDelete(reel.id)} 
                                            size="sm" 
                                            variant="outline"
                                            className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/30"
                                            disabled={actionLoading === reel.id}
                                        >
                                            {actionLoading === reel.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <>
                                                    <ShieldX className="h-3.5 w-3.5 mr-1" />
                                                    Hapus
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {reels.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada konten untuk dimoderasi</p>
                </div>
            )}

            {/* Block Reason Modal */}
            {showReasonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Blokir Konten</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                    Alasan Pemblokiran (opsional)
                                </label>
                                <textarea
                                    value={blockReason}
                                    onChange={e => setBlockReason(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 dark:text-white"
                                    rows={3}
                                    placeholder="Contoh: Konten mengandung unsur kekerasan"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    setShowReasonModal(null);
                                    setBlockReason('');
                                }}
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={() => handleBlock(showReasonModal, blockReason)}
                                className="bg-orange-600 hover:bg-orange-700"
                                disabled={actionLoading === showReasonModal}
                            >
                                {actionLoading === showReasonModal ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Blokir Konten'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showImageModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setShowImageModal(null)}
                >
                    <div className="max-w-4xl max-h-[90vh]">
                        <img 
                            src={showImageModal} 
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Halaman {meta.current_page} dari {meta.last_page} ({meta.total} konten)
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage((p: number) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === meta.last_page} 
                            onClick={() => setCurrentPage((p: number) => p + 1)}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
};
