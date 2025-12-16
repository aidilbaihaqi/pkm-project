import {
    AppFooter,
    AppNavbar,
    ReelsGrid,
    SellerCtaSection,
} from '@/components/landing';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
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

            <div className="min-h-screen bg-gray-50 font-sans dark:bg-gray-900">
                <AppNavbar />

                <main>
                    <ReelsGrid />
                    <SellerCtaSection />
                </main>

                <AppFooter />
            </div>
        </>
    );
}
