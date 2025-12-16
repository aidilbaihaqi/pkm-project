import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ⚙️ Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Panel administrasi untuk mengelola platform UMKMku.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                            <div className="text-2xl font-bold text-umkm-orange">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Active Sellers</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <div className="text-2xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Content</div>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                            <div className="text-2xl font-bold text-orange-600">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
