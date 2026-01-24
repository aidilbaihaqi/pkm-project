<?php

namespace App\Http\Controllers\Search;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use App\Models\UmkmProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Display the search page
     */
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        
        return Inertia::render('search', [
            'initialQuery' => $query,
            'suggestions' => $this->getSuggestions(),
        ]);
    }

    /**
     * Search for UMKM profiles and reels
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        if (empty($query)) {
            return response()->json([
                'umkm' => [],
                'reels' => [],
                'total' => 0,
            ]);
        }

        // Search UMKM profiles
        $umkmProfiles = UmkmProfile::with('user')
            ->where('is_blocked', false)
            ->where(function ($q) use ($query) {
                $q->where('nama_toko', 'like', "%{$query}%")
                    ->orWhere('kategori', 'like', "%{$query}%")
                    ->orWhere('deskripsi', 'like', "%{$query}%")
                    ->orWhere('alamat', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'nama_toko' => $profile->nama_toko,
                    'kategori' => $profile->kategori,
                    'alamat' => $profile->alamat,
                    'avatar' => $profile->avatar,
                    'is_open' => $profile->is_open,
                    'deskripsi' => $profile->deskripsi,
                ];
            });

        // Search Reels
        $reels = Reel::with(['umkmProfile.user'])
            ->where('status', 'published')
            ->where(function ($q) use ($query) {
                $q->where('product_name', 'like', "%{$query}%")
                    ->orWhere('caption', 'like', "%{$query}%")
                    ->orWhere('kategori', 'like', "%{$query}%");
            })
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($reel) {
                return [
                    'id' => $reel->id,
                    'product_name' => $reel->product_name,
                    'caption' => $reel->caption,
                    'price' => $reel->price,
                    'thumbnail_url' => $reel->thumbnail_url,
                    'kategori' => $reel->kategori,
                    'umkm' => [
                        'id' => $reel->umkmProfile->id,
                        'nama_toko' => $reel->umkmProfile->nama_toko,
                        'avatar' => $reel->umkmProfile->avatar,
                    ],
                ];
            });

        return response()->json([
            'umkm' => $umkmProfiles,
            'reels' => $reels,
            'total' => $umkmProfiles->count() + $reels->count(),
        ]);
    }

    /**
     * Get search suggestions based on popular searches
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('q', '');

        if (empty($query)) {
            return response()->json([
                'suggestions' => $this->getSuggestions(),
            ]);
        }

        // Get suggestions based on query
        $suggestions = [];

        // Search in product names
        $productSuggestions = Reel::where('status', 'published')
            ->where('product_name', 'like', "%{$query}%")
            ->select('product_name')
            ->distinct()
            ->limit(5)
            ->pluck('product_name')
            ->toArray();

        // Search in categories
        $categorySuggestions = UmkmProfile::where('kategori', 'like', "%{$query}%")
            ->select('kategori')
            ->distinct()
            ->limit(3)
            ->pluck('kategori')
            ->toArray();

        // Search in store names
        $storeSuggestions = UmkmProfile::where('is_blocked', false)
            ->where('nama_toko', 'like', "%{$query}%")
            ->select('nama_toko')
            ->distinct()
            ->limit(5)
            ->pluck('nama_toko')
            ->toArray();

        $suggestions = array_merge($productSuggestions, $categorySuggestions, $storeSuggestions);
        $suggestions = array_unique($suggestions);
        $suggestions = array_slice($suggestions, 0, 10);

        return response()->json([
            'suggestions' => array_values($suggestions),
        ]);
    }

    /**
     * Get default suggestions
     */
    private function getSuggestions(): array
    {
        // Get popular categories and products
        $categories = UmkmProfile::select('kategori')
            ->distinct()
            ->pluck('kategori')
            ->toArray();

        $popularProducts = Reel::where('status', 'published')
            ->inRandomOrder()
            ->limit(5)
            ->pluck('product_name')
            ->toArray();

        $suggestions = array_merge($categories, $popularProducts);
        
        return array_slice($suggestions, 0, 8);
    }
}
