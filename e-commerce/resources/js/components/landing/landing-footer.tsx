import { MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function AppFooter() {
    return (
        <footer className="border-t border-gray-100 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                            PKM Hyperlocal UMKM
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-teal-600">Tentang</a>
                        <a href="#" className="hover:text-teal-600">Bantuan</a>
                        <a href="#" className="hover:text-teal-600">Kontak</a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025 PKM Hyperlocal
                    </p>
                </div>
            </div>
        </footer>
    );
}
