import axios from "axios";

interface CacheOptions {
    ttl?: number;  // Time to live in milliseconds
    key?: string;
}

class CacheManager {
    private cache: Map<string, { data: any; timestamp: number }>;
    private defaultTTL: number;

    constructor(defaultTTL = 5 * 60 * 1000) { // 기본 TTL은 5분
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    /**
     * 캐시에 데이터를 저장
     * @param key - 캐시 키
     * @param data - 저장할 데이터
     * @param ttl - 데이터의 유효 시간
     */
    set(key: string, data: any, ttl?: number) {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + (ttl || this.defaultTTL)
        });
    }

    /**
     * 캐시에서 데이터를 가져옴
     * @param key - 캐시 키
     * @returns 캐시된 데이터 또는 null
     */
    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    /**
     * 캐시를 비움
     */
    clear() {
        this.cache.clear();
    }
}

export const cacheManager = new CacheManager();

/**
 * API 요청에 캐싱 적용
 * @param url - 요청할 URL
 * @param options - 캐시 옵션
 * @returns 캐시된 데이터 또는 새로 요청한 데이터
 */
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
