import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';

export default function Content() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Konten', href: '#' }]}>
            <Head title="Manajemen Konten" />
            <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Konten</h1>
                    <p>Page Under Construction</p>
                </div>
            </div>
        </AppLayout>
    );
}
