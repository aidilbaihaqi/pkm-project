import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Video, Wallet, TrendingUp, CheckCircle, Play, Users } from 'lucide-react';

const benefits = [
    {
        icon: Video,
        title: 'Upload Mudah',
        description: 'Rekam & upload langsung dari HP'
    },
    {
        icon: Wallet,
        title: 'Gratis Selamanya',
        description: 'Tanpa biaya apapun'
    },
    {
        icon: TrendingUp,
        title: 'Omzet Naik',
        description: 'Jangkau ribuan pembeli'
    },
];

export default function JoinUmkm() {
    return (
        <AppLayout>
            <Head title="Gabung UMKMku" />

            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-lg mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-umkm-green/10 px-4 py-2 text-sm font-medium text-umkm-green mb-6">
                        <Users className="h-4 w-4" />
                        10.000+ UMKM sudah bergabung
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Jualan Laris<br />
                        <span className="text-umkm-orange">Lewat Video</span> 🔥
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Promosikan produk UMKM-mu dengan video pendek. Mudah seperti pakai TikTok!
                    </p>

                    {/* Phone Preview */}
                    <div className="relative w-48 h-80 mx-auto mb-8">
                        {/* Phone Frame */}
                        <div className="absolute inset-0 rounded-[2rem] bg-gray-900 shadow-2xl overflow-hidden border-4 border-gray-800">
                            <img
                                src="https://picsum.photos/seed/umkm-preview/300/500"
                                alt="Preview App"
                                className="h-full w-full object-cover opacity-80"
                            />
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                                </div>
                            </div>
                            {/* Overlay Info */}
                            <div className="absolute bottom-4 left-3 right-3 text-white text-left">
                                <p className="text-xs font-semibold">@warung_butini</p>
                                <p className="text-[10px] opacity-70">Gudeg spesial hari ini! 🍛</p>
                            </div>
                        </div>
                        {/* Phone Notch */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full" />
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-center"
                            >
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-umkm-orange/10 text-umkm-orange mb-2">
                                    <benefit.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    {benefit.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                        asChild
                        size="lg"
                        className="w-full max-w-xs h-14 bg-umkm-orange hover:bg-umkm-orange-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-umkm-orange/20"
                    >
                        <Link href="/login">
                            Mulai Jualan Sekarang
                        </Link>
                    </Button>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-umkm-green" />
                            <span>100% Gratis</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-umkm-green" />
                            <span>Tanpa Ribet</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-umkm-orange font-medium hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
