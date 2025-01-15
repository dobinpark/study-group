/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ExtendedCacheModuleOptions,
    CacheTTLConfig,
    CacheKeyPrefix,
} from '../types/cache.types';
import { CACHE_CONFIG } from '../constants/cache-config.constants';
import { CACHE_CONSTANTS } from '../constants/cache.constants';
import { CacheStore } from '@nestjs/cache-manager';

type CustomCacheStore = CacheStore & {
    get: (key: string) => Promise<CacheTTLConfig>;
    set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
    del: (key: string) => Promise<void>;
};

export const getCacheConfig = (): ExtendedCacheModuleOptions => ({
    ttl: CACHE_CONSTANTS.DEFAULT_TTL,
    max: CACHE_CONSTANTS.MAX_CACHE_ITEMS,
    store: <CustomCacheStore>{
        get: async (key: string): Promise<CacheTTLConfig> => {
            const prefix = Object.keys(CACHE_CONFIG).find((p) => key.startsWith(p));

            if (prefix && prefix in CACHE_CONFIG) {
                return { ttl: CACHE_CONFIG[prefix as CacheKeyPrefix].ttl };
            }
            return { ttl: CACHE_CONSTANTS.DEFAULT_TTL };
        },
        set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
            // 필요한 경우 구현
        },
        del: async (key: string): Promise<void> => {
            // 필요한 경우 구현
        },
    },
});
