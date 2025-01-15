import { CacheKeyPrefix, CacheKeyParams } from '../types/cache.types';
import { CacheKeyError } from '../errors/cache.errors';
import { CACHE_CONSTANTS } from '../constants/cache.constants';
import { KEY_GENERATORS } from '../constants/cache-generators.constants';
import { CACHE_ERROR_MESSAGES } from '../constants/error-messages.constants';
import { CACHE_PREFIXES } from '../constants/cache-prefixes.constants';

export function createCacheKey(
    prefix: CacheKeyPrefix,
    params: CacheKeyParams = {},
): string {
    const sanitizedParams = sanitizeCacheParams(params);
    const generator = KEY_GENERATORS[prefix];
    if (!generator) {
        throw new CacheKeyError(CACHE_ERROR_MESSAGES.UNKNOWN_PREFIX(prefix));
    }
    return generator(sanitizedParams);
}

export function validateCacheKey(key: string): boolean {
    return Object.values(CACHE_PREFIXES).some((prefix) => key.startsWith(prefix));
}

export function sanitizeCacheParams(params: CacheKeyParams): CacheKeyParams {
    const { page, limit, query } = params;

    return {
        ...params,
        page: page && page > 0 ? page : CACHE_CONSTANTS.DEFAULT_PAGE,
        limit:
            limit && limit > 0 && limit <= CACHE_CONSTANTS.MAX_LIMIT
                ? limit
                : CACHE_CONSTANTS.DEFAULT_LIMIT,
        query: query?.slice(0, CACHE_CONSTANTS.MAX_QUERY_LENGTH),
    };
}
