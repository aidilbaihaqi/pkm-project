import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationPicker } from '@/components/ui/location-picker';
import MockLayout from '@/layouts/mock-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Seller', href: '/seller' },
    { title: 'Format Profil', href: '/seller/profile' },
];

interface ProfileForm {
    name: string;
    description: string;
    whatsapp: string;
    address: string;
    lat: number;
    lng: number;
    avatar: File | null;
    cover: File | null;
}

export default function EditProfile() {
    const { data, setData, post, processing, errors } = useForm<ProfileForm>({
        name: 'Warung Gudeg Bu Tini',
        description: 'Menyediakan gudeg asli Jogja dengan resep turun temurun.',
        whatsapp: '81234567890',
        address: 'Jl. Malioboro No. 123, Yogyakarta',
        lat: -7.7956,
        lng: 110.3695,
        avatar: null,
        cover: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Mock submission - in real app this goes to backend
        console.log('Submitting profile:', data);
        // post(route('seller.profile.update'));
        console.log('Update profile endpoint would be called here');
        alert('Profile saved (Mock Mode)');
    };

    return (
        <MockLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil Toko" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="mx-auto grid w-full max-w-2xl gap-2">
                    <h1 className="text-3xl font-bold">Profil Toko</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Lengkapi informasi toko Anda agar mudah ditemukan pembeli.
                    </p>
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
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Toko / Usaha</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Warung Makan Bu Tini"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Ceritakan sedikit tentang produk Anda..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
                                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                                    <div className="flex items-center">
                                        <div className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                            +62
                                        </div>
                                        <Input
                                            id="whatsapp"
                                            className="rounded-l-none"
                                            placeholder="81234567890"
                                            type="tel"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value.replace(/^0+/, ''))}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Nomor ini akan digunakan sebagai tujuan link chat "Pesan via WhatsApp".
                                    </p>
                                    {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat Lengkap</Label>
                                    <Input
                                        id="address"
                                        placeholder="Nama jalan, nomor, kelurahan, kecamatan..."
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <LocationPicker
                                        label="Titik Lokasi (Map)"
                                        value={{ lat: data.lat, lng: data.lng }}
                                        onChange={(val) => {
                                            setData((prev) => ({
                                                ...prev,
                                                lat: val.lat,
                                                lng: val.lng
                                            }));
                                        }}
                                        error={errors.lat || errors.lng}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700">
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Profil
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MockLayout>
    );
}
