/**
 * Frontend configuration from environment variables
 */
export const config = {
    appName: import.meta.env.VITE_APP_NAME || 'UMKMku',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
} as const;

/**
 * Build full API URL from endpoint
 */
export function apiUrl(endpoint: string): string {
    const base = config.apiBaseUrl.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
}
