import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationPicker } from '@/components/ui/location-picker';
import { AppLayout } from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Save, Loader2, AlertCircle, CheckCircle, Store } from 'lucide-react';
import { useState, useEffect, useCallback, type FormEvent } from 'react';
import UmkmController from '@/actions/App/Http/Controllers/Umkm/UmkmController';

interface ProfileData {
    id?: number;
    nama_toko: string;
    deskripsi: string;
    nomor_wa: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kategori: string;
    avatar: string | null;
    is_open: boolean;
    open_hours: string;
}

const categories = [
    { id: 'kuliner', name: 'Kuliner', emoji: '🍜' },
    { id: 'fashion', name: 'Fashion', emoji: '👗' },
    { id: 'kerajinan', name: 'Kerajinan', emoji: '🎨' },
    { id: 'kecantikan', name: 'Kecantikan', emoji: '💄' },
    { id: 'elektronik', name: 'Elektronik', emoji: '📱' },
    { id: 'pertanian', name: 'Pertanian', emoji: '🌾' },
];

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

export default function EditProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isNewProfile, setIsNewProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState<ProfileData>({
        nama_toko: '',
        deskripsi: '',
        nomor_wa: '',
        alamat: '',
        latitude: -7.7956,
        longitude: 110.3695,
        kategori: 'kuliner',
        avatar: null,
        is_open: true,
        open_hours: '08:00 - 17:00',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch existing profile on mount
    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/seller/profile', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            // Read as text first to handle HTML error responses
            const text = await response.text();
            console.log('Profile API response status:', response.status);
            console.log('Profile API response preview:', text.substring(0, 100));

            // Check for 401 Unauthorized immediately (works for both JSON and HTML)
            if (response.status === 401) {
                setError('Silakan login untuk mengakses halaman ini');
                return;
            }

            // Check if response is HTML (error/redirect page)
            if (text.trim().startsWith('<')) {
                console.error('Server returned HTML instead of JSON');

                // Check for login redirect
                if (response.status === 302 || text.toLowerCase().includes('login')) {
                    setError('Silakan login untuk mengakses halaman ini');
                    return;
                }

                // If it's a 404 with HTML, treat as new profile
                if (response.status === 404) {
                    setIsNewProfile(true);
                    return;
                }

                setError('Gagal memuat profil. Silakan coba lagi.');
                return;
            }

            // Handle JSON 404 - profile doesn't exist yet
            if (response.status === 404) {
                setIsNewProfile(true);
                return;
            }

            if (!response.ok) {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || 'Gagal memuat profil');
            }

            const data = JSON.parse(text);
            if (data.data) {
                setFormData({
                    id: data.data.id,
                    nama_toko: data.data.nama_toko || '',
                    deskripsi: data.data.deskripsi || '',
                    nomor_wa: data.data.nomor_wa?.replace(/^62/, '') || '',
                    alamat: data.data.alamat || '',
                    latitude: parseFloat(data.data.latitude) || -7.7956,
                    longitude: parseFloat(data.data.longitude) || 110.3695,
                    kategori: data.data.kategori || 'kuliner',
                    avatar: data.data.avatar,
                    is_open: data.data.is_open ?? true,
                    open_hours: data.data.open_hours || '08:00 - 17:00',
                });
                setIsNewProfile(false);
            } else {
                // No data means new profile
                setIsNewProfile(true);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err instanceof Error ? err.message : 'Gagal memuat profil');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleChange = (field: keyof ProfileData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});

        try {
            // Format phone number for API
            const phoneNumber = formData.nomor_wa.startsWith('0')
                ? '62' + formData.nomor_wa.substring(1)
                : formData.nomor_wa.startsWith('62')
                    ? formData.nomor_wa
                    : '62' + formData.nomor_wa;

            const payload = {
                nama_toko: formData.nama_toko,
                deskripsi: formData.deskripsi,
                nomor_wa: phoneNumber,
                alamat: formData.alamat,
                latitude: formData.latitude,
                longitude: formData.longitude,
                kategori: formData.kategori,
                is_open: formData.is_open,
                open_hours: formData.open_hours,
                avatar: formData.avatar,
            };

            const url = isNewProfile ? UmkmController.store.url() : UmkmController.update.url();
            const method = isNewProfile ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
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
                throw new Error(data.message || 'Gagal menyimpan profil');
            }

            showToast(isNewProfile ? 'Profil berhasil dibuat!' : 'Profil berhasil disimpan!', 'success');

            if (isNewProfile) {
                setIsNewProfile(false);
                setFormData(prev => ({ ...prev, id: data.data?.id }));
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            showToast(err instanceof Error ? err.message : 'Gagal menyimpan profil', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <AppLayout>
                <Head title="Edit Profil Toko" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400">Memuat profil...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Error state
    if (error) {
        const isAuthError = error.toLowerCase().includes('login');
        return (
            <AppLayout>
                <Head title="Edit Profil Toko" />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <p className="text-gray-500 dark:text-gray-400">{error}</p>
                        {isAuthError ? (
                            <a
                                href="/login"
                                className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Masuk
                            </a>
                        ) : (
                            <Button onClick={fetchProfile} className="bg-teal-600 hover:bg-teal-700">
                                Coba Lagi
                            </Button>
                        )}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Edit Profil Toko" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 pb-24 md:gap-8 md:p-8 md:pb-8">
                <div className="mx-auto grid w-full max-w-2xl gap-2">
                    <div className="flex items-center gap-3">
                        <Store className="h-8 w-8 text-teal-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {isNewProfile ? 'Buat Profil Toko' : 'Edit Profil Toko'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {isNewProfile
                                    ? 'Lengkapi informasi toko Anda untuk mulai berjualan.'
                                    : 'Perbarui informasi toko Anda kapan saja.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Informasi Dasar */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Nama toko dan deskripsi singkat tentang usaha Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Avatar Upload */}
                                <div className="space-y-2">
                                    <Label>Foto Profil Toko</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            {formData.avatar ? (
                                                <img
                                                    src={formData.avatar}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Store className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                className="cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // Preview image locally
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            handleChange('avatar', reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Format: JPG, PNG, WebP. Maks 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_toko">Nama Toko / Usaha *</Label>
                                    <Input
                                        id="nama_toko"
                                        placeholder="Contoh: Warung Makan Bu Tini"
                                        value={formData.nama_toko}
                                        onChange={(e) => handleChange('nama_toko', e.target.value)}
                                        required
                                    />
                                    {errors.nama_toko && <p className="text-sm text-red-500">{errors.nama_toko}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <textarea
                                        id="deskripsi"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Ceritakan sedikit tentang produk Anda..."
                                        value={formData.deskripsi}
                                        onChange={(e) => handleChange('deskripsi', e.target.value)}
                                    />
                                    {errors.deskripsi && <p className="text-sm text-red-500">{errors.deskripsi}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Kategori *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => handleChange('kategori', cat.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.kategori === cat.id
                                                    ? 'bg-teal-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {cat.emoji} {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.kategori && <p className="text-sm text-red-500">{errors.kategori}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kontak & Lokasi */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kontak & Lokasi</CardTitle>
                                <CardDescription>
                                    Agar pembeli bisa menghubungi dan menemukan Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomor_wa">Nomor WhatsApp *</Label>
                                    <div className="flex items-center">
                                        <div className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                            +62
                                        </div>
                                        <Input
                                            id="nomor_wa"
                                            className="rounded-l-none"
                                            placeholder="81234567890"
                                            type="tel"
                                            value={formData.nomor_wa}
                                            onChange={(e) => handleChange('nomor_wa', e.target.value.replace(/^0+/, ''))}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Nomor ini akan digunakan sebagai tujuan link chat "Pesan via WhatsApp".
                                    </p>
                                    {errors.nomor_wa && <p className="text-sm text-red-500">{errors.nomor_wa}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat Lengkap *</Label>
                                    <Input
                                        id="alamat"
                                        placeholder="Nama jalan, nomor, kelurahan, kecamatan..."
                                        value={formData.alamat}
                                        onChange={(e) => handleChange('alamat', e.target.value)}
                                        required
                                    />
                                    {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                                </div>

                                <div className="space-y-2">
                                    <LocationPicker
                                        label="Titik Lokasi (Map)"
                                        value={{ lat: formData.latitude, lng: formData.longitude }}
                                        onChange={(val) => {
                                            handleChange('latitude', val.lat);
                                            handleChange('longitude', val.lng);
                                        }}
                                        error={errors.latitude || errors.longitude}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="open_hours">Jam Operasional</Label>
                                    <Input
                                        id="open_hours"
                                        placeholder="08:00 - 17:00"
                                        value={formData.open_hours}
                                        onChange={(e) => handleChange('open_hours', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_open"
                                        checked={formData.is_open}
                                        onChange={(e) => handleChange('is_open', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <Label htmlFor="is_open" className="cursor-pointer">
                                        Toko sedang buka
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.visit('/seller')}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isNewProfile ? 'Buat Profil' : 'Simpan Profil'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
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
