import { Head, useForm } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Youtube, Tag, DollarSign, Package, Upload as UploadIcon, Play, X } from 'lucide-react';

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

export default function Upload() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        youtube_url: '',
        product_name: '',
        caption: '',
        price: '',
        category: '',
    });

    // Update video preview when URL changes
    useEffect(() => {
        const id = getYouTubeVideoId(youtubeUrl);
        setVideoId(id);
        setData('youtube_url', youtubeUrl);
    }, [youtubeUrl]);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setData('category', categoryId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just log - akan connect ke API nanti
        console.log('Submitting:', data);
        alert('Video berhasil disubmit! (Demo)');
    };

    const clearVideo = () => {
        setYoutubeUrl('');
        setVideoId(null);
        setData('youtube_url', '');
    };

    return (
        <AppLayout>
            <Head title="Upload Video" />

            <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Upload Video
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Bagikan video produk UMKM-mu dari YouTube
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* YouTube URL Input */}
                    <div>
                        <Label htmlFor="youtube_url" className="flex items-center gap-2 mb-2">
                            <Youtube className="h-4 w-4 text-red-500" />
                            Link Video YouTube
                        </Label>
                        <Input
                            id="youtube_url"
                            type="url"
                            placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Mendukung format: youtube.com/watch, youtu.be, youtube.com/shorts
                        </p>
                    </div>

                    {/* Video Preview */}
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
                                onClick={clearVideo}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* No video placeholder */}
                    {!videoId && (
                        <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 aspect-video flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                            <Play className="h-12 w-12 mb-2" />
                            <p className="text-sm">Preview video akan muncul di sini</p>
                        </div>
                    )}

                    {/* Product Name */}
                    <div>
                        <Label htmlFor="product_name" className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-umkm-orange" />
                            Nama Produk
                        </Label>
                        <Input
                            id="product_name"
                            type="text"
                            placeholder="Contoh: Gudeg Spesial Bu Tini"
                            value={data.product_name}
                            onChange={(e) => setData('product_name', e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                    </div>

                    {/* Caption */}
                    <div>
                        <Label htmlFor="caption" className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            Caption
                        </Label>
                        <Textarea
                            id="caption"
                            placeholder="Tulis deskripsi menarik tentang produkmu... #umkm #lokal"
                            value={data.caption}
                            onChange={(e) => setData('caption', e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
                            required
                        />
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
                                type="text"
                                placeholder="25.000"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="pl-10 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <Label className="flex items-center gap-2 mb-3">
                            Kategori
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? 'bg-umkm-orange text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat.emoji} {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!videoId || !data.product_name || processing}
                        className="w-full h-12 bg-umkm-orange hover:bg-umkm-orange-dark text-white font-semibold rounded-xl text-base"
                    >
                        <UploadIcon className="h-5 w-5 mr-2" />
                        {processing ? 'Mengupload...' : 'Upload Video'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
