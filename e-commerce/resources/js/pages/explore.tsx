import { useState } from 'react';
import {AppLayout} from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Play, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for Explore Grid
const exploreItems = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    thumbnail: `https://picsum.photos/seed/${i + 100}/400/600`, // Vertical aspect ratio
    views: '320.3K',
    caption: 'Video caption goes here...',
    user: {
        avatar: `https://ui-avatars.com/api/?name=User+${i}&background=random`,
        username: `user_${i}`
    }
}));

const categories = [
    "All", "Singing & Dancing", "Comedy", "Sports", "Anime & Comics", "Relationship", "Shows", "Lipsync", "Daily Life", "Beauty Care"
];

export default function Explore() {
    const [activeTab, setActiveTab] = useState("All");

    return (
        <AppLayout>
            <Head title="Explore" />

            <div className="w-full max-w-7xl mx-auto px-4 py-6">

                {/* Category Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={cn(
                                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                                activeTab === cat
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {exploreItems.map((item) => (
                        <div key={item.id} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-900 cursor-pointer">
                            <img
                                src={item.thumbnail}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

                            {/* Top Right Icon */}
                            <div className="absolute top-2 right-2 p-1">
                                <Play className="fill-white text-white h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                                <div className="flex items-center gap-1 mb-1 text-xs font-bold shadow-sm">
                                    <Heart className="h-3.5 w-3.5 fill-transparent" />
                                    {item.views}
                                </div>
                                <div className="flex items-center gap-2 text-xs opacity-90">
                                    <img src={item.user.avatar} className="h-5 w-5 rounded-full border border-white/50" alt="" />
                                    <span className="truncate">{item.user.username}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
