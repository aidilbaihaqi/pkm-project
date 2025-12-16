import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

export default function Login() {
    return (
        <>
            <Head title="Masuk - UMKMku" />

            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="flex items-center justify-center py-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                            <img src="/logo-umkmku.webp" alt="UMKMku" className="h-10 w-10 object-contain" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            UMKMku
                        </span>
                    </Link>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center px-4 py-8">
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-800">
                            <div className="mb-8 text-center">
                                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    Selamat Datang! 👋
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Masuk untuk melanjutkan ke dashboard
                                </p>
                            </div>

                            {/* Google Login Button */}
                            <Button
                                asChild
                                size="lg"
                                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                <a href="/login/redirect">
                                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Masuk dengan Google
                                </a>
                            </Button>

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                                    atau
                                </span>
                                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                            </div>

                            {/* Info Text */}
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Dengan masuk, Anda menyetujui{' '}
                                <a href="#" className="text-umkm-orange hover:underline">
                                    Syarat & Ketentuan
                                </a>{' '}
                                dan{' '}
                                <a href="#" className="text-umkm-orange hover:underline">
                                    Kebijakan Privasi
                                </a>
                            </p>
                        </div>

                        {/* Seller CTA */}
                        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-center dark:border-orange-800 dark:bg-orange-900/20">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Punya UMKM? Daftar dan promosikan produkmu!
                            </p>
                            <a
                                href="/login/redirect"
                                className="mt-2 inline-block text-sm font-medium text-umkm-orange hover:underline"
                            >
                                Daftar Sebagai Seller →
                            </a>
                        </div>

                        {/* Back to Home */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    © 2025 UMKMku
                </footer>
            </div>
        </>
    );
}
