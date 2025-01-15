import { CacheConfig, CacheKeyPrefix } from '../types/cache.types';
import { CACHE_CONSTANTS } from './cache.constants';
import { CACHE_PREFIXES } from './cache-prefixes.constants';

export const CACHE_CONFIG: Record<CacheKeyPrefix, CacheConfig> = {
    [CACHE_PREFIXES.POSTS_LIST]: {
        ttl: CACHE_CONSTANTS.DEFAULT_TTL,
        prefix: CACHE_PREFIXES.POSTS_LIST,
    },
    [CACHE_PREFIXES.POST_DETAIL]: {
        ttl: CACHE_CONSTANTS.DETAIL_TTL,
        prefix: CACHE_PREFIXES.POST_DETAIL,
    },
    [CACHE_PREFIXES.POSTS_SEARCH]: {
        ttl: CACHE_CONSTANTS.SEARCH_TTL,
        prefix: CACHE_PREFIXES.POSTS_SEARCH,
    },
};
