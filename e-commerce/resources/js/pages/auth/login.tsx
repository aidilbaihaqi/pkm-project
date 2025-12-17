import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';
import { useState, FormEvent } from 'react';
import { Mail } from 'lucide-react';

function EmailLoginForm() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (email) {
            // Redirect ke WorkOS SSO dengan login_hint (email)
            window.location.href = `/login/sso?email=${encodeURIComponent(email)}`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="email"
                    placeholder="Masukkan email kamu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-12 rounded-full border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                />
            </div>
            <Button
                type="submit"
                size="lg"
                disabled={!email}
                className="w-full h-12 bg-umkm-orange hover:bg-umkm-orange/90 text-white rounded-full font-semibold"
            >
                Masuk dengan Email
            </Button>
        </form>
    );
}

export default function Login() {
    return (
        <AppLayout>
            <Head title="Masuk - UMKMku" />

            {/* TikTok-style Login - Full Screen */}
            <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col pb-20 md:pb-0">

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center px-8 py-8">

                    {/* Logo */}
                    <div className="mb-6">
                        <div className="h-full w-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            <img src="/logo-umkmku.webp" alt="UMKMku" className="h-16 w-16 object-contain" />
                        </div>
                    </div>

                    {/* App Name */}
                    <h1 className="text-3xl font-bold mb-2">UMKMku</h1>
                    <p className="text-gray-600 dark:text-white/80 text-sm mb-10 text-center">
                        Jualan Laris Lewat Video
                    </p>

                    {/* Login Button */}
                    <div className="w-full max-w-xs space-y-4">
                        {/* Google Login */}
                        <Button
                            asChild
                            size="lg"
                            className="w-full h-12 bg-white dark:bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-full font-semibold shadow-md"
                        >
                            <a href="/login/redirect" className="flex items-center justify-center gap-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">atau</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        {/* Email SSO Login */}
                        <EmailLoginForm />

                        {/* Info - Auto Register */}
                        <p className="text-center text-gray-600 dark:text-white/70 text-xs">
                            Belum punya akun? Otomatis terdaftar saat pertama masuk
                        </p>
                    </div>
                </main>

                {/* Bottom Section */}
                <div className="px-8 pb-8">
                    {/* Terms */}
                    <p className="text-center text-xs text-gray-500 dark:text-white/60 leading-relaxed">
                        Dengan masuk, kamu menyetujui{' '}
                        <a href="#" className="text-umkm-orange hover:underline">Syarat & Ketentuan</a>
                        {' '}dan{' '}
                        <a href="#" className="text-umkm-orange hover:underline">Kebijakan Privasi</a>
                        {' '}UMKMku
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
