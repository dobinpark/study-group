export type CacheErrorMessage = string | ((param: string) => string);

export type CacheErrorMessages = {
  readonly MISSING_ID: string;
  readonly MISSING_QUERY: string;
  readonly UNKNOWN_PREFIX: (prefix: string) => string;
};

export const CACHE_ERROR_MESSAGES: CacheErrorMessages = {
  MISSING_ID: 'ID is required for post-detail cache key',
  MISSING_QUERY: 'Query is required for posts-search cache key',
  UNKNOWN_PREFIX: (prefix: string) => `Unknown cache key prefix: ${prefix}`,
} as const;
