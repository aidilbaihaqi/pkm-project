import { Link, usePage } from '@inertiajs/react';
import { PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function DesktopHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 md:px-8 dark:border-gray-800 dark:bg-gray-900">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                    <img src="/logo-umkmku.webp" alt="UMKMku" className="h-10 w-10 object-contain" />
                </div>
                <span className="hidden text-xl font-bold tracking-tight text-gray-900 md:block dark:text-white">
                    UMKMku
                </span>
            </Link>

            {/* Center: Search Bar (Desktop - Hidden as per request) */}
            <div className="hidden max-w-md flex-1 px-8 md:block">
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Upload Button */}
                {auth.user && (
                    <Button asChild variant="secondary" className="hidden gap-2 font-semibold md:flex">
                        <Link href="/seller/upload">
                            <PlusSquare className="h-4 w-4" />
                            Upload
                        </Link>
                    </Button>
                )}

                {auth.user ? (
                    // Logged In Actions
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-8 w-8 cursor-pointer border border-gray-200">
                                    <AvatarImage src={auth.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}`} />
                                    <AvatarFallback>{auth.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>{auth.user.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/seller/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="text-red-500 cursor-pointer">
                                    <Link href="/logout" method="post" as="button" className="w-full text-left">
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    // Guest Actions
                    <div className="flex items-center gap-3">
                        <Button asChild className="bg-umkm-orange hover:bg-umkm-orange-dark font-bold px-6">
                            <Link href="/login">Masuk</Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
