import {
    ExecutionContext,
    Injectable,
    Logger,
    CallHandler,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';

// 캐시 키 상수 정의
const CACHE_KEYS = {
    getPostsSearch: (q: string, page?: number, limit?: number) => 
        `posts:search:${q}:${page || 1}:${limit || 10}`,
    getPostDetail: (id: string) => `posts:detail:${id}`,
    getPostsList: (page?: number, limit?: number) => 
        `posts:list:${page || 1}:${limit || 10}`,
};

// 캐시 관련 에러 클래스 정의
class CacheKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CacheKeyError';
    }
}

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
    private readonly logger = new Logger(CustomCacheInterceptor.name);

    private logCacheHit(key: string): void {
        this.logger.debug(`Cache hit: ${key}`);
    }

    private logCacheMiss(key: string): void {
        this.logger.debug(`Cache miss: ${key}`);
    }

    private validateParams(
        params: Record<string, any>,
        required: string[],
    ): boolean {
        return required.every((param) => params[param] !== undefined);
    }

    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const { url, method } = request;

        if (method !== 'GET') {
            return undefined;
        }

        const { query, params } = request;
        try {
            if (url.includes('/posts/search')) {
                if (!this.validateParams(query, ['q'])) return undefined;
                return CACHE_KEYS.getPostsSearch(query.q, query.page, query.limit);
            }

            if (url.includes('/posts') && params.id) {
                if (!this.validateParams(params, ['id'])) return undefined;
                return CACHE_KEYS.getPostDetail(params.id);
            }

            if (url === '/posts') {
                return CACHE_KEYS.getPostsList(query.page, query.limit);
            }
        } catch (error) {
            if (error instanceof CacheKeyError) {
                this.logger.warn(`Cache key generation failed: ${error.message}`);
            } else {
                this.logger.error('Unexpected cache error:', error);
            }
            return undefined;
        }

        return undefined;
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const key = this.trackBy(context);
        if (key) {
            const value = await this.cacheManager.get(key);
            if (value) {
                this.logCacheHit(key);
            } else {
                this.logCacheMiss(key);
            }
        }
        return super.intercept(context, next);
    }
}
