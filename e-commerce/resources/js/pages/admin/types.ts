export interface Stats {
    total_users: number;
    total_sellers: number;
    total_reels: number;
    engagement: {
        total_views: number;
        total_likes: number;
        total_shares: number;
        total_click_wa: number;
    };
}

export interface ApiSeller {
    id: number;
    name: string;
    email: string;
    umkm_profile?: {
        id: number;
        nama_toko: string;
        kategori: string;
        is_blocked: boolean;
        reels_count?: number;
    } | null;
    statistics?: {
        total_views: number;
        total_likes: number;
        total_shares: number;
        total_click_wa: number;
    };
}

export interface Seller {
    id: number;
    name: string;
    email: string;
    umkm_name: string | null;
    kategori: string | null;
    reels_count: number;
    is_blocked: boolean;
    stats: {
        views: number;
        likes: number;
        shares: number;
        wa_clicks: number;
    };
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    created_at?: string;
}

export interface ModerationReel {
    id: number;
    video_url: string;
    product_name: string;
    caption: string;
    thumbnail_url: string;
    is_blocked: boolean;
    blocked_reason?: string;
    blocked_at?: string;
    created_at: string;
    user?: {
        name: string;
        avatar: string;
    };
    umkm_profile?: {
        nama_toko: string;
    };
}
