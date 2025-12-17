import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Store, Users, Video, Target, Heart, Zap, MapPin, Mail, Phone } from 'lucide-react';

const stats = [
    { value: '10K+', label: 'UMKM Terdaftar' },
    { value: '500K+', label: 'Video Dibuat' },
    { value: '34', label: 'Provinsi' },
    { value: '1M+', label: 'Pengguna Aktif' },
];

const values = [
    {
        icon: Heart,
        title: 'Mendukung Lokal',
        description: 'Kami percaya kekuatan ekonomi ada di tangan UMKM Indonesia'
    },
    {
        icon: Zap,
        title: 'Mudah Digunakan',
        description: 'Platform yang simpel, bisa dipakai siapa saja tanpa ribet'
    },
    {
        icon: Target,
        title: 'Fokus ke Hasil',
        description: 'Setiap fitur dirancang untuk meningkatkan penjualan UMKM'
    },
];

const team = [
    { name: 'Tim Pengembang', role: 'Mahasiswa PKM', avatar: '👨‍💻' },
    { name: 'Tim Desain', role: 'UI/UX Designer', avatar: '🎨' },
    { name: 'Tim Riset', role: 'Market Research', avatar: '📊' },
];

export default function About() {
    return (
        <AppLayout>
            <Head title="Tentang Kami - UMKMku" />

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-umkm-orange/10 px-4 py-2 text-sm font-medium text-umkm-orange mb-4">
                        <Store className="h-4 w-4" />
                        Tentang UMKMku
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Membantu UMKM Indonesia<br />
                        <span className="text-umkm-orange">Go Digital</span> 🇮🇩
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        UMKMku adalah platform video pendek yang membantu pelaku UMKM mempromosikan produk mereka secara gratis, mudah, dan efektif.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="rounded-xl bg-gradient-to-br from-umkm-orange/5 to-umkm-green/5 p-4 text-center border border-gray-100 dark:border-gray-800"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-umkm-orange mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission */}
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 md:p-8 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-umkm-orange text-white">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Misi Kami
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Kami ingin setiap UMKM di Indonesia, dari Sabang sampai Merauke, bisa memanfaatkan kekuatan video pendek untuk mempromosikan produk mereka. Dengan UMKMku, jualan jadi lebih mudah — cukup rekam video dari HP, upload, dan jangkau ribuan calon pembeli.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Nilai-Nilai Kami
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="rounded-xl bg-white dark:bg-gray-800 p-5 border border-gray-100 dark:border-gray-700 hover:border-umkm-orange/30 transition-colors"
                            >
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-umkm-orange/10 text-umkm-orange mb-3">
                                    <value.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Tim Kami
                    </h2>
                    <div className="flex justify-center gap-6 flex-wrap">
                        {team.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-2">{member.avatar}</div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                    {member.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {member.role}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Proyek ini dikembangkan sebagai bagian dari Program Kreativitas Mahasiswa (PKM)
                    </p>
                </div>

                {/* Contact */}
                <div className="rounded-2xl bg-umkm-orange p-6 md:p-8 text-white text-center">
                    <h2 className="text-xl font-bold mb-2">Ada Pertanyaan?</h2>
                    <p className="opacity-90 mb-4 text-sm">
                        Hubungi kami untuk informasi lebih lanjut
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:hello@umkmku.id"
                            className="flex items-center gap-2 text-sm bg-white/20 rounded-full px-4 py-2 hover:bg-white/30 transition-colors"
                        >
                            <Mail className="h-4 w-4" />
                            hello@umkmku.id
                        </a>
                        <a
                            href="https://wa.me/6281234567890"
                            className="flex items-center gap-2 text-sm bg-white/20 rounded-full px-4 py-2 hover:bg-white/30 transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Siap bergabung dengan ribuan UMKM lainnya?
                    </p>
                    <Button asChild className="bg-umkm-orange hover:bg-umkm-orange-dark">
                        <Link href="/register-seller">
                            Daftar Sekarang - Gratis!
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
