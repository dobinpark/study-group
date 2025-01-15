// Types
import type { CacheKeyGenerators } from '../types/cache.types';

// Error
import { CacheKeyError } from '../errors/cache.errors';

// Constants
import { CACHE_PREFIXES } from './cache-prefixes.constants';
import { CACHE_ERROR_MESSAGES } from './error-messages.constants';

export const KEY_GENERATORS: CacheKeyGenerators = {
    [CACHE_PREFIXES.POSTS_LIST]: (params) => {
        const { page, limit } = params;
        return `${CACHE_PREFIXES.POSTS_LIST}:${page}:${limit}`;
    },
    [CACHE_PREFIXES.POST_DETAIL]: (params) => {
        const { id } = params;
        if (!id) throw new CacheKeyError(CACHE_ERROR_MESSAGES.MISSING_ID);
        return `${CACHE_PREFIXES.POST_DETAIL}:${id}`;
    },
    [CACHE_PREFIXES.POSTS_SEARCH]: (params) => {
        const { query, page, limit } = params;
        if (!query) throw new CacheKeyError(CACHE_ERROR_MESSAGES.MISSING_QUERY);
        return `${CACHE_PREFIXES.POSTS_SEARCH}:${query}:${page}:${limit}`;
    },
};
