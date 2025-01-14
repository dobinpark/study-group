import { CacheModuleOptions } from '@nestjs/cache-manager';
import { CachePrefix } from '../constants/cache-prefixes.constants';

export type CacheKeyPrefix = CachePrefix;

export interface CacheKeyParams {
  page?: number;
  limit?: number;
  id?: string;
  query?: string;
}

export interface CacheKeys {
  POSTS_LIST: CacheKeyPrefix;
  POST_DETAIL: CacheKeyPrefix;
  POSTS_SEARCH: CacheKeyPrefix;
  getPostsList: (page: number, limit: number) => string;
  getPostDetail: (id: string) => string;
  getPostsSearch: (query: string, page: number, limit: number) => string;
}

export interface CacheConfig {
  ttl: number;
  prefix: CacheKeyPrefix;
}

export interface CacheTTLConfig {
  ttl: number;
}

export interface CacheStoreOptions {
  ttl: number;
  max: number;
  store: {
    get: (key: string) => Promise<CacheTTLConfig>;
    set?: <T>(key: string, value: T, ttl?: number) => Promise<void>;
    del?: (key: string) => Promise<void>;
  };
}

export type ExtendedCacheModuleOptions = CacheModuleOptions & CacheStoreOptions;

export type CacheKeyGenerator = (params: CacheKeyParams) => string;

export type CacheKeyGenerators = {
  [K in CacheKeyPrefix]: CacheKeyGenerator;
};
