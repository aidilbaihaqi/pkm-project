import { VideoFeed } from '@/components/landing/video-feed';
import { AppLayout } from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="PKM Hyperlocal UMKM | Temukan UMKM Terdekat">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
                <meta
                    name="description"
                    content="Platform hyperlocal untuk menemukan UMKM terdekat melalui video reels yang menarik. Pesan langsung via WhatsApp!"
                />
            </Head>

            <VideoFeed />
        </AppLayout>
    );
}
