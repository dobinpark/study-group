import { CacheKeys } from '../types/cache.types';
import { createCacheKey } from '../utils/cache.utils';
import { CACHE_PREFIXES } from './cache-prefixes.constants';

export const CACHE_KEYS: CacheKeys = {
  POSTS_LIST: CACHE_PREFIXES.POSTS_LIST,
  POST_DETAIL: CACHE_PREFIXES.POST_DETAIL,
  POSTS_SEARCH: CACHE_PREFIXES.POSTS_SEARCH,

  getPostsList: (page: number, limit: number) =>
    createCacheKey(CACHE_PREFIXES.POSTS_LIST, { page, limit }),
  getPostDetail: (id: string) =>
    createCacheKey(CACHE_PREFIXES.POST_DETAIL, { id }),
  getPostsSearch: (query: string, page: number, limit: number) =>
    createCacheKey(CACHE_PREFIXES.POSTS_SEARCH, { query, page, limit }),
} as const;
