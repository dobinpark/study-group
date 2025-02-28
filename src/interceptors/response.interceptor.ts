import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResponse, BaseResponse } from '../types/response.types';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, DataResponse<T> | BaseResponse> {
    private readonly logger = new Logger(TransformInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<DataResponse<T> | BaseResponse> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        
        return next
            .handle()
            .pipe(
                map(response => {
                    // 이미 표준 응답 형식인 경우 그대로 반환
                    if (response && typeof response === 'object' && 'success' in response) {
                        return response;
                    }
                    
                    // null이나 undefined인 경우 처리
                    if (response === null || response === undefined) {
                        this.logger.debug(`${method} ${url}: 응답 데이터가 null/undefined입니다`);
                        return {
                            success: true,
                            data: null,
                            message: '데이터가 없습니다.'
                        };
                    }
                    
                    // 페이지네이션 정보가 있는 경우 처리
                    if (typeof response === 'object' && response !== null && 
                        ('items' in response && 'total' in response && 'page' in response)) {
                        const { items, total, page, limit, totalPages, ...rest } = response as any;
                        return {
                            success: true,
                            data: items || [],
                            pagination: { total, page, limit, totalPages },
                            ...rest
                        };
                    }
                    
                    // 일반 데이터 객체 처리
                    return {
                        success: true,
                        data: response,
                    };
                }),
            );
    }
}
