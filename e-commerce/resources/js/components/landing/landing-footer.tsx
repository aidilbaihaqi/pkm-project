import { Link } from '@inertiajs/react';

export function AppFooter() {
    return (
        <footer className="border-t border-gray-100 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                            <img src="/logo-umkmku.webp" alt="UMKMku" className="h-8 w-8 object-contain" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                            UMKMku
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-umkm-orange">Tentang</a>
                        <a href="#" className="hover:text-umkm-orange">Bantuan</a>
                        <a href="#" className="hover:text-umkm-orange">Kontak</a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025 UMKMku
                    </p>
                </div>
            </div>
        </footer>
    );
}
