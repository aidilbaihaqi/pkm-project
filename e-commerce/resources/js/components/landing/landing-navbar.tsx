import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { MapPin, Search, User } from 'lucide-react';
import { useState } from 'react';

export function AppNavbar() {
    const { auth } = usePage<SharedData>().props;
    const [showSearch, setShowSearch] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="flex h-12 items-center justify-between gap-2 sm:h-14 sm:gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden sm:h-8 sm:w-8">
                            <img src="/logo-umkmku.webp" alt="UMKMku" className="h-7 w-7 object-contain sm:h-8 sm:w-8" />
                        </div>
                        <span className="hidden text-base font-bold text-gray-900 sm:block sm:text-lg dark:text-white">
                            UMKMku
                        </span>
                    </Link>

                    {/* Location Indicator - Mobile optimized */}
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs transition-colors hover:bg-gray-200 sm:flex-initial sm:gap-2 sm:px-4 sm:py-2 sm:text-sm dark:bg-gray-800 dark:hover:bg-gray-700">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-umkm-green sm:h-4 sm:w-4" />
                        <span className="truncate text-gray-700 dark:text-gray-300">
                            Mendeteksi lokasi...
                        </span>
                    </button>

                    {/* Search - Desktop only */}
                    <div className="hidden flex-1 md:block">
                        <div className="relative mx-auto max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari UMKM atau produk..."
                                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-umkm-orange focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:border-umkm-orange"
                            />
                        </div>
                    </div>

                    {/* Mobile Search Button */}
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 md:hidden dark:bg-gray-800"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <Search className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Auth */}
                    {auth.user ? (
                        <Button asChild size="sm" className="h-8 bg-umkm-orange px-3 text-xs hover:bg-umkm-orange-dark sm:h-9 sm:px-4 sm:text-sm">
                            <Link href="/dashboard">
                                <User className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Dasbor</span>
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild size="sm" className="h-8 bg-umkm-orange px-3 text-xs hover:bg-umkm-orange-dark sm:h-9 sm:px-4 sm:text-sm">
                            <Link href="/login">Masuk</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Search Expanded */}
                {showSearch && (
                    <div className="border-t border-gray-100 py-2 md:hidden dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari UMKM atau produk..."
                                autoFocus
                                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-umkm-orange focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
