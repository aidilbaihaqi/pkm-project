import { Head, router, usePage } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useCallback } from 'react';
import { Youtube, Tag, DollarSign, Package, Play, X, ArrowLeft, CheckCircle, Loader2, AlertCircle, Save } from 'lucide-react';
import ReelsController from '@/actions/App/Http/Controllers/Reels/ReelsController';

const categories = [
    { id: 'kuliner', name: 'Kuliner', emoji: '🍜' },
    { id: 'fashion', name: 'Fashion', emoji: '👗' },
    { id: 'kerajinan', name: 'Kerajinan', emoji: '🎨' },
    { id: 'kecantikan', name: 'Kecantikan', emoji: '💄' },
    { id: 'elektronik', name: 'Elektronik', emoji: '📱' },
    { id: 'pertanian', name: 'Pertanian', emoji: '🌾' },
];

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Get CSRF token from cookie
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

interface ReelData {
    id: number;
    video_url: string | null;
    thumbnail_url: string | null;
    product_name: string;
    caption: string | null;
    price: number | null;
    kategori: string;
    type: 'video' | 'image';
    status: 'draft' | 'review' | 'published';
}

export default function EditReel() {
    const { props } = usePage<{ id: string }>();
    const reelId = props.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState<ReelData>({
        id: 0,
        video_url: '',
        thumbnail_url: null,
        product_name: '',
        caption: '',
        price: null,
        kategori: 'kuliner',
        type: 'video',
        status: 'published',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [videoId, setVideoId] = useState<string | null>(null);

    // Fetch reel data on mount
    const fetchReel = useCallback(async () => {
        if (!reelId) {
            setError('ID reel tidak ditemukan');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(ReelsController.show.url(parseInt(reelId)), {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Reel tidak ditemukan');
            }

            const data = await response.json();
            if (data.data) {
                setFormData({
                    id: data.data.id,
                    video_url: data.data.video_url || '',
                    thumbnail_url: data.data.thumbnail_url,
                    product_name: data.data.product_name || '',
                    caption: data.data.caption || '',
                    price: data.data.price ? parseFloat(data.data.price) : null,
                    kategori: data.data.kategori || 'kuliner',
                    type: data.data.type || 'video',
                    status: data.data.status || 'published',
                });

                // Extract video ID if URL exists
                if (data.data.video_url) {
                    setVideoId(getYouTubeVideoId(data.data.video_url));
                }
            }
        } catch (err) {
            console.error('Error fetching reel:', err);
            setError(err instanceof Error ? err.message : 'Gagal memuat data reel');
        } finally {
            setIsLoading(false);
        }
    }, [reelId]);

    useEffect(() => {
        fetchReel();
    }, [fetchReel]);

    // Update video ID when URL changes
    useEffect(() => {
        if (formData.video_url) {
            setVideoId(getYouTubeVideoId(formData.video_url));
        } else {
            setVideoId(null);
        }
    }, [formData.video_url]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleChange = (field: keyof ReelData, value: string | number | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent, newStatus?: 'published' | 'draft') => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});

        try {
            const payload = {
                video_url: formData.video_url || null,
                thumbnail_url: formData.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null),
                product_name: formData.product_name,
                caption: formData.caption,
                price: formData.price,
                kategori: formData.kategori,
                type: formData.type,
                status: newStatus || formData.status,
            };

            const response = await fetch(ReelsController.update.url({ reel: formData.id }), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data.message || 'Gagal menyimpan perubahan');
            }

            showToast('Perubahan berhasil disimpan!', 'success');

            // Redirect to content page after short delay
            setTimeout(() => {
                router.visit('/seller/content');
            }, 1500);
        } catch (err) {
            console.error('Error updating reel:', err);
            showToast(err instanceof Error ? err.message : 'Gagal menyimpan perubahan', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <AppLayout>
                <Head title="Edit Konten" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 text-umkm-orange animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <AppLayout>
                <Head title="Edit Konten" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <p className="text-gray-500 dark:text-gray-400">{error}</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => router.visit('/seller/content')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                            <Button onClick={fetchReel} className="bg-umkm-orange hover:bg-umkm-orange-dark">
                                Coba Lagi
                            </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`Edit: ${formData.product_name}`} />

            <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => router.visit('/seller/content')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Konten
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Perbarui informasi produk Anda
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* YouTube URL Input */}
                    {formData.type === 'video' && (
                        <>
                            <div>
                                <Label htmlFor="video_url" className="flex items-center gap-2 mb-2">
                                    <Youtube className="h-4 w-4 text-red-500" />
                                    Link Video YouTube
                                </Label>
                                <Input
                                    id="video_url"
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                                    value={formData.video_url || ''}
                                    onChange={(e) => handleChange('video_url', e.target.value)}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.video_url && <p className="text-sm text-red-500 mt-1">{errors.video_url}</p>}
                            </div>

                            {videoId && (
                                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}?hl=id`}
                                        title="YouTube video preview"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleChange('video_url', '')}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {!videoId && (
                                <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 aspect-video flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                                    <Play className="h-12 w-12 mb-2" />
                                    <p className="text-sm">Preview video akan muncul di sini</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Product Name */}
                    <div>
                        <Label htmlFor="product_name" className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-umkm-orange" />
                            Nama Produk *
                        </Label>
                        <Input
                            id="product_name"
                            type="text"
                            placeholder="Contoh: Gudeg Spesial Bu Tini"
                            value={formData.product_name}
                            onChange={(e) => handleChange('product_name', e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                        {errors.product_name && <p className="text-sm text-red-500 mt-1">{errors.product_name}</p>}
                    </div>

                    {/* Caption */}
                    <div>
                        <Label htmlFor="caption" className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            Deskripsi
                        </Label>
                        <Textarea
                            id="caption"
                            placeholder="Tulis deskripsi menarik tentang produkmu... #umkm #lokal"
                            value={formData.caption || ''}
                            onChange={(e) => handleChange('caption', e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
                        />
                        {errors.caption && <p className="text-sm text-red-500 mt-1">{errors.caption}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price" className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            Harga (Opsional)
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                                Rp
                            </span>
                            <Input
                                id="price"
                                type="number"
                                placeholder="25000"
                                value={formData.price || ''}
                                onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : null)}
                                className="pl-10 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <Label className="flex items-center gap-2 mb-3">Kategori *</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleChange('kategori', cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.kategori === cat.id
                                        ? 'bg-umkm-orange text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat.emoji} {cat.name}
                                </button>
                            ))}
                        </div>
                        {errors.kategori && <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <Label className="flex items-center gap-2 mb-3">Status</Label>
                        <div className="flex gap-3">
                            {[
                                { value: 'published', label: 'Tayang', color: 'bg-green-500' },
                                { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => handleChange('status', status.value as 'published' | 'draft')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${formData.status === status.value
                                        ? `${status.color} text-white`
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/seller/content')}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex-[2] bg-umkm-orange hover:bg-umkm-orange-dark text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white min-w-[280px] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {toast.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
