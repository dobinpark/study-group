import axios from "axios";

interface CacheOptions {
    ttl?: number;  // Time to live in milliseconds
    key?: string;
}

class CacheManager {
    private cache: Map<string, { data: any; timestamp: number }>;
    private defaultTTL: number;

    constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    set(key: string, data: any, ttl?: number) {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + (ttl || this.defaultTTL)
        });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear() {
        this.cache.clear();
    }
}

export const cacheManager = new CacheManager();

// API 요청에 캐싱 적용
export const cachedFetch = async (url: string, options: CacheOptions = {}) => {
    const cacheKey = options.key || url;
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

const response = await axios.get(url);
    cacheManager.set(cacheKey, response.data, options.ttl);
    return response.data;
}; 