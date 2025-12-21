import { Link, usePage } from '@inertiajs/react';
import { Home, Compass, Store, Info, PlusSquare, Video, User } from 'lucide-react';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MobileNav() {
    const { auth } = usePage<SharedData>().props;
    const url = usePage().url;
    const [pressedItem, setPressedItem] = useState<string | null>(null);

    const isActive = (path: string) => url === path;

    const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => {
        const isPressed = pressedItem === href;

        return (
            <Link
                href={href}
                onTouchStart={() => setPressedItem(href)}
                onTouchEnd={() => setTimeout(() => setPressedItem(null), 150)}
                onClick={() => setPressedItem(href)}
                className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-all duration-200",
                    isPressed ? "scale-90" : "scale-100"
                )}
            >
                <div className={cn(
                    "transition-all duration-200",
                    active && "animate-bounce-subtle"
                )}>
                    <Icon className={cn(
                        "h-6 w-6 transition-all duration-200",
                        active ? "text-teal-600 fill-teal-600/10 scale-110" : "text-gray-500",
                        isPressed && "scale-95"
                    )} />
                </div>
                <span className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    active ? "text-teal-600 font-semibold" : "text-gray-500"
                )}>
                    {label}
                </span>
            </Link>
        );
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden dark:border-gray-800 dark:bg-gray-900/95 pb-safe">
            <div className="flex items-end justify-between px-2 pb-2 pt-2">
                {auth.user ? (
                    // Seller Navigation
                    <>
                        <NavItem href="/" icon={Home} label="Beranda" active={isActive('/')} />
                        <NavItem href="/explore" icon={Compass} label="Jelajahi" active={isActive('/explore')} />
                        <Link href="/upload" className="flex flex-col items-center justify-center -mt-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white shadow-lg shadow-teal-500/30 ring-4 ring-white dark:ring-gray-900">
                                <PlusSquare className="h-6 w-6" />
                            </div>
                            <span className="mt-1 text-[10px] font-medium text-gray-500">Unggah</span>
                        </Link>
                        <NavItem href="/content" icon={Video} label="Konten" active={isActive('/content')} />
                        <NavItem href="/seller/profile" icon={User} label="Profil" active={isActive('/seller/profile')} />
                    </>
                ) : (
                    // Guest Navigation
                    <>
                        <NavItem href="/" icon={Home} label="Beranda" active={isActive('/')} />
                        <NavItem href="/explore" icon={Compass} label="Jelajahi" active={isActive('/explore')} />

                        {/* Center Join Button - Floating style */}
                        <Link href="/register-seller" className="flex flex-col items-center justify-center -mt-6 px-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 ring-4 ring-white dark:ring-gray-900 animate-pulse">
                                <Store className="h-6 w-6" />
                            </div>
                            <span className="mt-1 text-[10px] font-bold text-gray-900 dark:text-gray-100">Gabung</span>
                        </Link>

                        <NavItem href="/about" icon={Info} label="Tentang" active={isActive('/about')} />
                        <NavItem href="/login" icon={User} label="Masuk" active={isActive('/login')} />
                    </>
                )}
            </div>
        </nav>
    );
}
