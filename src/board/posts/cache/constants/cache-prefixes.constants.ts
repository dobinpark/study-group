export const CACHE_PREFIXES = {
    POSTS_LIST: 'posts-list',
    POST_DETAIL: 'post-detail',
    POSTS_SEARCH: 'posts-search',
} as const;

export type CachePrefix = (typeof CACHE_PREFIXES)[keyof typeof CACHE_PREFIXES];
