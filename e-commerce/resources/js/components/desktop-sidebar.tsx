import { Link, usePage } from '@inertiajs/react';
import { Home, Compass, Store, Info, PlusSquare, Video, User, Search, MapPin, Loader2 } from 'lucide-react';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';

interface NearbyUmkm {
    id: number;
    nama_toko: string;
    kategori: string;
    avatar: string | null;
    distance?: number;
}

export function DesktopSidebar() {
    const { auth } = usePage<SharedData>().props;
    const url = usePage().url;

    const isSearchPage = url.startsWith('/search');

    const isActive = (path: string) => url === path;

    // State for nearby UMKM
    const [nearbyUmkms, setNearbyUmkms] = useState<NearbyUmkm[]>([]);
    const [isLoadingNearby, setIsLoadingNearby] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Get user's location
    useEffect(() => {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Fallback to default location (Jakarta)
                    setUserLocation({ lat: -6.2088, lng: 106.8456 });
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    // Fetch nearby UMKM when location is available
    const fetchNearbyUmkm = useCallback(async () => {
        if (!userLocation) return;

        setIsLoadingNearby(true);
        try {
            const response = await fetch(`/api/reels?lat=${userLocation.lat}&lng=${userLocation.lng}&limit=10`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const text = await response.text();
                if (!text.trim().startsWith('<')) {
                    const data = JSON.parse(text);
                    // Extract unique UMKM from reels
                    const umkmMap = new Map<number, NearbyUmkm>();
                    (data.data || []).forEach((reel: {
                        umkm_profile_id: number;
                        umkm_profile?: { id: number; nama_toko: string; kategori: string; avatar: string | null };
                        distance?: number
                    }) => {
                        if (reel.umkm_profile && !umkmMap.has(reel.umkm_profile_id)) {
                            umkmMap.set(reel.umkm_profile_id, {
                                id: reel.umkm_profile.id,
                                nama_toko: reel.umkm_profile.nama_toko,
                                kategori: reel.umkm_profile.kategori,
                                avatar: reel.umkm_profile.avatar,
                                distance: reel.distance,
                            });
                        }
                    });
                    setNearbyUmkms(Array.from(umkmMap.values()).slice(0, 5));
                }
            }
        } catch (err) {
            console.error('Error fetching nearby UMKM:', err);
        } finally {
            setIsLoadingNearby(false);
        }
    }, [userLocation]);

    useEffect(() => {
        if (userLocation) {
            fetchNearbyUmkm();
        }
    }, [userLocation, fetchNearbyUmkm]);

    const SidebarItem = ({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) => (
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

    const formatDistance = (meters?: number) => {
        if (!meters) return '';
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        }
        return `${(meters / 1000).toFixed(1)}km`;
    };

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
                        <SidebarItem href="/search" icon={Search} label="Cari" active={isActive('/search')} />
                        <SidebarItem href="/" icon={Home} label="Beranda" active={isActive('/')} />
                        <SidebarItem href="/explore" icon={Compass} label="Jelajahi" active={isActive('/explore')} />
                        <SidebarItem href="/upload" icon={PlusSquare} label="Unggah" active={isActive('/upload')} />
                        <SidebarItem href="/content" icon={Video} label="Konten" active={isActive('/content')} />
                        <SidebarItem href="/seller/profile" icon={User} label="Profil UMKM" active={isActive('/seller/profile')} />
                    </>
                ) : (
                    // Guest Menu
                    <>
                        <SidebarItem href="/search" icon={Search} label="Cari" active={isActive('/search')} />
                        <SidebarItem href="/" icon={Home} label="Beranda" active={isActive('/')} />
                        <SidebarItem href="/explore" icon={Compass} label="Jelajahi" active={isActive('/explore')} />
                        <SidebarItem href="/register-seller" icon={Store} label="Gabung UMKM" active={isActive('/register-seller')} />
                        <SidebarItem href="/about" icon={Info} label="Tentang" active={isActive('/about')} />
                    </>
                )}
            </div>

            {/* Nearest UMKM - Only visible on LG screens and not on search page */}
            {!isSearchPage && (
                <div className="hidden lg:block border-t border-gray-100 py-4 px-4 dark:border-gray-800">
                    <p className="mb-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">UMKM Terdekat</p>
                    <div className="space-y-3">
                        {isLoadingNearby ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                        ) : nearbyUmkms.length > 0 ? (
                            nearbyUmkms.map((umkm) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.id}`}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-green-500 overflow-hidden flex items-center justify-center shrink-0">
                                        {umkm.avatar ? (
                                            <img src={umkm.avatar} alt={umkm.nama_toko} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-white font-bold text-xs">
                                                {umkm.nama_toko.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{umkm.nama_toko}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {formatDistance(umkm.distance)}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-2">
                                Tidak ada UMKM terdekat
                            </p>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
