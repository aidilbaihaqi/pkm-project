import { Link, usePage } from '@inertiajs/react';
import { Search, MapPin, PlusSquare, User, MessageCircle, Send, LogIn, Menu } from 'lucide-react';
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-lg shadow-teal-600/20">
                    <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="hidden text-xl font-bold tracking-tight text-gray-900 md:block dark:text-white">
                    Hyperlocal
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
                        <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors dark:text-white dark:hover:bg-gray-800">
                            <Send className="h-6 w-6 -rotate-45" />
                            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></div>
                        </button>
                        <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors dark:text-white dark:hover:bg-gray-800">
                            <MessageCircle className="h-6 w-6" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">2</span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-8 w-8 cursor-pointer border border-gray-200">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}`} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <Link href="/logout" method="post" as="button" className="w-full">
                                    <DropdownMenuItem className="text-red-500 cursor-pointer">
                                        Log out
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    // Guest Actions
                    <div className="flex items-center gap-3">
                        <Button asChild className="bg-teal-600 hover:bg-teal-700 font-bold px-6">
                            <Link href="/login">Masuk</Link>
                        </Button>

                    </div>
                )}
            </div>
        </header>
    );
}
