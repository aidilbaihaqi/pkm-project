import { ShieldX, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {reels.map((reel: ModerationReel) => (
                    <div key={reel.id} className="relative group bg-black rounded-lg overflow-hidden aspect-9/16">
                        <img src={reel.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                        
                        {/* Blocked Badge */}
                        {reel.is_blocked && (
                            <div className="absolute top-2 right-2 z-10">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                    <ShieldAlert className="h-3 w-3" />
                                    Blocked
                                </span>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div className="text-white text-xs">
                                <p className="font-bold truncate">{reel.umkm_profile?.nama_toko}</p>
                                <p className="truncate opacity-80">{reel.product_name}</p>
                                <p className="text-[10px] opacity-60 mt-1 line-clamp-2">{reel.caption}</p>
                                {reel.is_blocked && reel.blocked_reason && (
                                    <div className="mt-2 p-2 bg-red-900/50 rounded text-[10px]">
                                        <p className="font-semibold">Alasan:</p>
                                        <p>{reel.blocked_reason}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                {reel.is_blocked ? (
                                    <Button 
                                        onClick={() => handleUnblock(reel.id)} 
                                        size="sm" 
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={actionLoading === reel.id}
                                    >
                                        {actionLoading === reel.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-4 w-4 mr-2" /> Unblock
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => setShowReasonModal(reel.id)} 
                                        size="sm" 
                                        variant="outline"
                                        className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                                        disabled={actionLoading === reel.id}
                                    >
                                        {actionLoading === reel.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldAlert className="h-4 w-4 mr-2" /> Block
                                            </>
                                        )}
                                    </Button>
                                )}
                                
                                <Button 
                                    onClick={() => handleDelete(reel.id)} 
                                    size="sm" 
                                    variant="destructive" 
                                    className="w-full"
                                    disabled={actionLoading === reel.id}
                                >
                                    {actionLoading === reel.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldX className="h-4 w-4 mr-2" /> Hapus
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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

            {meta && meta.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p: number) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="flex items-center text-sm dark:text-gray-400">Hal {currentPage}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === meta.last_page} onClick={() => setCurrentPage((p: number) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            )}
        </div>
    )
};
