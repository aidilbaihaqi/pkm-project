import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import { Store, Upload, TrendingUp } from 'lucide-react';

export function SellerCtaSection() {
    return (
        <section className="border-t border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Main CTA */}
                    <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-center shadow-lg sm:p-12">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                            <Store className="h-4 w-4" />
                            Untuk Pelaku UMKM
                        </div>

                        <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                            Promosikan UMKM-mu Sekarang!
                        </h2>

                        <p className="mx-auto mb-8 max-w-xl text-teal-100">
                            Upload video promosi dan jangkau ribuan pembeli di sekitarmu.
                            100% gratis, tanpa biaya komisi!
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="w-full bg-white px-8 text-teal-600 hover:bg-teal-50 sm:w-auto"
                            >
                                <Link href={login()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Daftar & Upload Video
                                </Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                            <div>
                                <div className="text-2xl font-bold text-white sm:text-3xl">100%</div>
                                <div className="text-xs text-teal-100 sm:text-sm">Gratis</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white sm:text-3xl">5 menit</div>
                                <div className="text-xs text-teal-100 sm:text-sm">Setup</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white sm:text-3xl">
                                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="text-xs text-teal-100 sm:text-sm">Jangkauan Lokal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
