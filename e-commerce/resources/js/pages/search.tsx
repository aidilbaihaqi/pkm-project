import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { X, Search as SearchIcon, MapPin, Store, ShoppingBag } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import axios from 'axios';

interface UmkmSearchResult {
    id: number;
    nama_toko: string;
    kategori: string;
    alamat: string;
    avatar: string | null;
    is_open: boolean;
    deskripsi: string;
}

interface ReelSearchResult {
    id: number;
    product_name: string;
    caption: string;
    price: number;
    thumbnail_url: string;
    kategori: string;
    umkm: {
        id: number;
        nama_toko: string;
        avatar: string | null;
    };
}

interface SearchProps {
    initialQuery?: string;
    suggestions?: string[];
}

export default function Search({ initialQuery = '', suggestions: initialSuggestions = [] }: SearchProps) {
    const [query, setQuery] = useState(initialQuery);
    const [history, setHistory] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
    const [searchResults, setSearchResults] = useState<{
        umkm: UmkmSearchResult[];
        reels: ReelSearchResult[];
        total: number;
    } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Load search history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (!searchQuery.trim()) {
                setSearchResults(null);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const results = await axios.get('/api/search', {
                    params: { q: searchQuery },
                });
                setSearchResults(results.data);
                setShowResults(true);
                
                // Get dynamic suggestions based on query
                const suggestionsData = await axios.get('/api/search/suggestions', {
                    params: { q: searchQuery },
                });
                setSuggestions(suggestionsData.data.suggestions);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500),
        []
    );

    // Trigger search when query changes
    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        // Add to history
        const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        
        // Perform search
        debouncedSearch(query);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        const newHistory = [suggestion, ...history.filter(h => h !== suggestion)].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout>
            <Head title="Search" />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Search Drawer Panel - Fixed width next to collapsed sidebar */}
                <div className="w-full md:w-[400px] border-r border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col">
                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">Search</h1>
                            <button 
                                onClick={() => router.visit('/')} 
                                className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative mb-6">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari produk, toko, atau kategori..."
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-3 pl-4 pr-10 text-base focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {query && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setQuery('');
                                            setShowResults(false);
                                        }} 
                                        className="bg-gray-200 rounded-full p-0.5 hover:bg-gray-300 transition-colors"
                                    >
                                        <X className="h-3 w-3 text-gray-600" />
                                    </button>
                                )}
                                <SearchIcon className={cn(
                                    "h-5 w-5",
                                    isSearching ? "text-blue-500 animate-pulse" : "text-gray-400"
                                )} />
                            </div>
                        </form>

                        {/* Search History */}
                        {history.length > 0 && !showResults && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold text-gray-500">Recent Searches</h2>
                                    <button 
                                        onClick={clearHistory}
                                        className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {history.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group" 
                                            onClick={() => setQuery(item)}
                                        >
                                            <SearchIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:underline">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {!showResults && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold text-gray-500">You may like</h2>
                                </div>

                                <div className="space-y-1">
                                    {suggestions.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group" 
                                            onClick={() => handleSuggestionClick(item)}
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0 group-hover:bg-gray-400" />
                                            <span className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:underline">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results Panel */}
                {showResults && searchResults && (
                    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                        <div className="max-w-6xl mx-auto p-6">
                            {/* Results Summary */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">
                                    Search Results for "{query}"
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Found {searchResults.total} results
                                </p>
                            </div>

                            {searchResults.total === 0 && (
                                <div className="text-center py-12">
                                    <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}

                            {/* UMKM Results */}
                            {searchResults.umkm.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Store className="h-5 w-5 text-gray-600" />
                                        <h3 className="text-xl font-bold">UMKM Stores</h3>
                                        <span className="text-sm text-gray-500">({searchResults.umkm.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {searchResults.umkm.map((umkm) => (
                                            <Link
                                                key={umkm.id}
                                                href={`/umkm/${umkm.id}`}
                                                className="bg-white dark:bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                                        {umkm.avatar ? (
                                                            <img src={umkm.avatar} alt={umkm.nama_toko} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Store className="w-full h-full p-2 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                            {umkm.nama_toko}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            {umkm.kategori}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="truncate">{umkm.alamat}</span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className={cn(
                                                                "text-xs px-2 py-1 rounded-full",
                                                                umkm.is_open 
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                            )}>
                                                                {umkm.is_open ? 'Open' : 'Closed'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reels Results */}
                            {searchResults.reels.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                                        <h3 className="text-xl font-bold">Products</h3>
                                        <span className="text-sm text-gray-500">({searchResults.reels.length})</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {searchResults.reels.map((reel) => (
                                            <div
                                                key={reel.id}
                                                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800 cursor-pointer"
                                            >
                                                <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-800 relative">
                                                    <img 
                                                        src={reel.thumbnail_url} 
                                                        alt={reel.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                                                        {reel.product_name}
                                                    </h4>
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                                                        {formatPrice(reel.price)}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                                            {reel.umkm.avatar ? (
                                                                <img src={reel.umkm.avatar} alt={reel.umkm.nama_toko} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Store className="w-full h-full p-1 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {reel.umkm.nama_toko}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

