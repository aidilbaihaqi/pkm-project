import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { X, Search as SearchIcon } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

export default function Search() {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    // Mock initial recommendation data to match user request (Step 1018 image)
    const suggestions = [
        "keripik singkong UMKM",
        "sambal rumahan",
        "kue kering homemade",
        "kopi lokal nusantara",
        "produk olahan ikan",
        "oleh-oleh khas daerah",
        "madu asli UMKM",
        "abon ikan rumahan"
    ];


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        // Logic for search would go here
        console.log("Searching for:", query);
    };

    return (
        <AppLayout>
            <Head title="Search" />

            {/* Search Drawer Panel - Fixed width next to collapsed sidebar */}
            <div className="h-[calc(100vh-4rem)] w-full md:w-[400px] border-r border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col">

                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">Search</h1>
                        <button onClick={() => window.history.back()} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="staycation sama pacar"
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-3 pl-4 pr-10 text-base focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                            autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {query && (
                                <button type="button" onClick={() => setQuery('')} className="bg-gray-200 rounded-full p-0.5 hover:bg-gray-300 transition-colors">
                                    <X className="h-3 w-3 text-gray-600" />
                                </button>
                            )}
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </form>

                    {/* You may like */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-gray-500">You may like</h2>
                        </div>

                        <div className="space-y-1">
                            {suggestions.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group" onClick={() => setQuery(item)}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0 group-hover:bg-gray-400" />
                                    <span className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:underline">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Close Button removed (moved to header) */}
        </AppLayout>
    );
}
