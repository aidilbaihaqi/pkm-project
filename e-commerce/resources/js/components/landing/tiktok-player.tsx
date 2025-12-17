import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, MessageCircle, MoreVertical, Share2, Heart, Music2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Use strict type for the reel object to match what we have in ReelsGrid
interface Reel {
    id: number;
    thumbnail: string;
    umkmName: string;
    umkmId?: number;
    product: string;
    description?: string; // Add description if needed
    whatsapp: string;
    views: number;
    likes: number;
    comments: number;
    distance?: string;
}

interface TikTokPlayerProps {
    reels: Reel[];
    initialIndex?: number;
    onClose: () => void;
}

export function TikTokPlayer({ reels, initialIndex = 0, onClose }: TikTokPlayerProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll active reel into view on mount
    useEffect(() => {
        if (containerRef.current && initialIndex > 0) {
            const height = containerRef.current.clientHeight;
            containerRef.current.scrollTop = height * initialIndex;
        }
    }, [initialIndex]);

    // Handle scroll snap detection
    const handleScroll = () => {
        if (!containerRef.current) return;

        const scrollTop = containerRef.current.scrollTop;
        const height = containerRef.current.clientHeight;
        const index = Math.round(scrollTop / height);

        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white">
            {/* Header / Back Button */}
            <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={onClose}
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="font-semibold text-sm">
                    Reels
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Vertical Feed */}
            <div
                ref={containerRef}
                className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth no-scrollbar"
                onScroll={handleScroll}
                style={{ scrollBehavior: 'smooth' }}
            >
                {reels.map((reel, index) => (
                    <div
                        key={reel.id}
                        className="relative h-full w-full snap-center snap-always flex items-center justify-center bg-gray-900"
                    >
                        {/* Video / Image Placeholder */}
                        {/* In real implementation, this would be a <video> tag */}
                        <div className="relative h-full w-full">
                            <img
                                src={reel.thumbnail}
                                alt={reel.product}
                                className="h-full w-full object-cover opacity-80" // Darken slightly for clearer text
                            />

                            {/* Play Button Overlay (Simulated) */}
                            {/* <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <div className="border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                                </div>
                            </div> */}
                        </div>

                        {/* Right Sidebar Interactions */}
                        <div className="absolute bottom-20 right-2 flex flex-col items-center gap-4 z-40 pb-4">
                            {/* Profile Avatar */}
                            <div className="relative mb-2">
                                <div className="h-12 w-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-gray-800">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reel.umkmName)}&background=random`} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                                </div>
                                {/* Plus Badge */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-red-500 p-0.5 text-white">
                                    <div className="h-3 w-3 flex items-center justify-center text-[10px] font-bold">+</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <button className="flex flex-col items-center gap-1 group">
                                <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-transform">
                                    <Heart className="h-8 w-8 fill-white/10 text-white" />
                                </div>
                                <span className="text-xs font-medium">{reel.likes}</span>
                            </button>

                            <button className="flex flex-col items-center gap-1 group">
                                <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-transform">
                                    <MessageCircle className="h-8 w-8 text-white" />
                                </div>
                                <span className="text-xs font-medium">{reel.comments}</span>
                            </button>

                            <button className="flex flex-col items-center gap-1 group">
                                <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-transform">
                                    <Share2 className="h-8 w-8 text-white" />
                                </div>
                                <span className="text-xs font-medium">Share</span>
                            </button>

                            {/* WhatsApp special action */}
                            <button className="flex flex-col items-center gap-1 mt-2 group">
                                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center animate-pulse shadow-lg group-active:scale-90 transition-transform">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-4 pb-8 md:pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20">
                            <div className="max-w-[80%]">
                                {/* Username */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-base md:text-lg hover:underline cursor-pointer">
                                        @{reel.umkmName.replace(/\s+/g, '').toLowerCase()}
                                    </h3>
                                    <span className="text-xs bg-teal-500/80 px-1.5 py-0.5 rounded text-white font-medium">
                                        UMKM
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm md:text-base mb-2 line-clamp-2">
                                    {reel.description || `Menikmati ${reel.product} yang lezat dan otentik. #kuliner #umkm #${reel.umkmName.split(' ')[0].toLowerCase()}`}
                                </p>

                                {/* Product Tag / Music */}
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-200">
                                    <Music2 className="h-3 w-3 animate-spin-slow" />
                                    <span>Original Sound - {reel.umkmName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
