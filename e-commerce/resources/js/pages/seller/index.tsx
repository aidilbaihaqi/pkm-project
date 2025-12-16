import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Seller Dashboard', href: '/seller' },
];

export default function SellerDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🏪 Seller Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selamat datang di dashboard seller. Kelola toko dan konten Anda di sini.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
                            <div className="text-2xl font-bold text-teal-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">WhatsApp Clicks</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <div className="text-2xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Videos</div>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
