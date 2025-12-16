import { Link, usePage } from '@inertiajs/react';
import { Home, Compass, Store, Info, PlusSquare, Video, User, Search, MapPin, LogOut } from 'lucide-react';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function DesktopSidebar() {
    const { auth } = usePage<SharedData>().props;
    const url = usePage().url;

    const isSearchPage = url.startsWith('/search');

    const isActive = (path: string) => url === path;

    const SidebarItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => (
        <Link href={href} className={cn(
            "flex items-center gap-3 rounded-xl px-2 py-3 transition-all duration-200",
            active
                ? "font-bold bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                : "font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            isSearchPage ? "justify-center px-0" : ""
        )}>
            <Icon className="h-7 w-7" />
            <span className={cn("text-lg lg:text-lg hidden", isSearchPage ? "hidden" : "lg:block")}>{label}</span>
        </Link>
    );

    return (
        <aside className={cn(
            "fixed left-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto border-r border-gray-100 bg-white py-4 dark:border-gray-800 dark:bg-gray-900 no-scrollbar transition-all duration-300",
            isSearchPage ? "hidden md:flex w-[72px]" : "hidden w-[72px] lg:w-[240px] md:flex"
        )}>

            {/* Main Navigation */}
            <div className="flex-1 px-2 space-y-1">
                {auth.user ? (
                    // Seller Menu
                    <>
                        <SidebarItem href="/search" icon={Search} label="Search" active={isActive('/search')} />
                        <SidebarItem href="/" icon={Home} label="Home" active={isActive('/')} />
                        <SidebarItem href="/explore" icon={Compass} label="Explore" active={isActive('/explore')} />
                        <SidebarItem href="/seller/upload" icon={PlusSquare} label="Upload" active={isActive('/seller/upload')} />
                        <SidebarItem href="/seller/content" icon={Video} label="Konten" active={isActive('/seller/content')} />
                        <SidebarItem href="/seller/profile" icon={User} label="Profil" active={isActive('/seller/profile')} />
                    </>
                ) : (
                    // Guest Menu
                    <>
                        <SidebarItem href="/search" icon={Search} label="Search" active={isActive('/search')} />
                        <SidebarItem href="/" icon={Home} label="Home" active={isActive('/')} />
                        <SidebarItem href="/explore" icon={Compass} label="Explore" active={isActive('/explore')} />
                        <SidebarItem href="/register-seller" icon={Store} label="Join UMKM" active={isActive('/register-seller')} />
                        <SidebarItem href="/about" icon={Info} label="About" active={isActive('/about')} />
                    </>
                )}
            </div>

            {/* Nearest UMKM (Dummy) - Only visible on LG screens and not on search page */}
            {!isSearchPage && (
                <div className="hidden lg:block border-t border-gray-100 py-4 px-4 dark:border-gray-800">
                    <p className="mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">UMKM Terdekat</p>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=UMKM+${i}&background=random`} alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">UMKM {i}</h4>
                                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {i * 100}m
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
