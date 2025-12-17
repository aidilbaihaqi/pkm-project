import { MobileNav } from '@/components/mobile-nav';
import { cn } from '@/lib/utils';
import { DesktopSidebar } from '@/components/desktop-sidebar';
import { DesktopHeader } from '@/components/desktop-header';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

function AppLayout({ breadcrumbs, children }: AppLayoutProps) {
    const isSearchPage = typeof window !== 'undefined' ? window.location.pathname.startsWith('/search') : false;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header Fixed Top - Hidden on Search, Hidden on Mobile via CSS */}
            {!isSearchPage && <DesktopHeader />}

            <div className={cn("flex", !isSearchPage ? "md:pt-16" : "")}>
                {/* Sidebar Fixed Left */}
                <DesktopSidebar />

                {/* Main Content */}
                <main className={cn(
                    "flex-1 w-full transition-all duration-300",
                    !isSearchPage ? "pb-20 md:pb-0" : "", // Always add bottom padding/margin for mobile nav
                    isSearchPage ? "md:ml-[72px]" : "md:ml-[72px] lg:ml-[240px]"
                )}>
                    {children}
                </main>
            </div>

            {/* Mobile Nav Fixed Bottom - Hidden on Search */}
            {!isSearchPage && <MobileNav />}
        </div>
    );
}


export { AppLayout };
export default AppLayout;
