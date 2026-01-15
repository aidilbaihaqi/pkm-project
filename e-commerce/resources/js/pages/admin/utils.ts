import { ApiSeller, Seller } from './types';

// Transform API seller to frontend format
export function transformSeller(apiSeller: ApiSeller): Seller {
    return {
        id: apiSeller.id,
        name: apiSeller.name,
        email: apiSeller.email,
        umkm_name: apiSeller.umkm_profile?.nama_toko || null,
        kategori: apiSeller.umkm_profile?.kategori || null,
        reels_count: apiSeller.umkm_profile?.reels_count || 0,
        is_blocked: apiSeller.umkm_profile?.is_blocked || false,
        stats: {
            views: apiSeller.statistics?.total_views || 0,
            likes: apiSeller.statistics?.total_likes || 0,
            shares: apiSeller.statistics?.total_shares || 0,
            wa_clicks: apiSeller.statistics?.total_click_wa || 0,
        },
    };
}

// Get CSRF token
export const getCsrfToken = (): string => {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return '';
};
