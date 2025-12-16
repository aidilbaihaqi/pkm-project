import { Head } from '@inertiajs/react';
import { AppLayout } from '@/layouts/app-layout';

export default function Upload() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Upload', href: '#' }]}>
            <Head title="Upload Video" />
            <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
                    <p>Page Under Construction</p>
                </div>
            </div>
        </AppLayout>
    );
}
