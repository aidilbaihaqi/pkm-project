import { ShieldX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModerationReel, PaginationMeta } from '../types';
import { getCsrfToken } from '../utils';

interface ModerationViewProps {
    reels: ModerationReel[];
    fetchReels: (page: number) => void;
    meta: PaginationMeta | null;
    currentPage: number;
    setCurrentPage: (page: any) => void;
}

export const ModerationView = ({ reels, fetchReels, meta, currentPage, setCurrentPage }: ModerationViewProps) => {
    const handleDelete = async (id: number) => {
        if (!confirm('Hapus konten ini secara permanen?')) return;
        try {
            await fetch(`/api/admin/moderation/${id}`, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            });
            fetchReels(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {reels.map((reel: ModerationReel) => (
                    <div key={reel.id} className="relative group bg-black rounded-lg overflow-hidden aspect-9/16">
                        <img src={reel.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div className="text-white text-xs">
                                <p className="font-bold truncate">{reel.umkm_profile?.nama_toko}</p>
                                <p className="truncate opacity-80">{reel.description}</p>
                            </div>
                            <Button onClick={() => handleDelete(reel.id)} size="sm" variant="destructive" className="w-full">
                                <ShieldX className="h-4 w-4 mr-2" /> Hapus
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

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
