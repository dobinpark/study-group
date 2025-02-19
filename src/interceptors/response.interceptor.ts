import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResponse, BaseResponse } from '../types/response.types';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map(response => {
                    if (response && response.success !== undefined) {
                        return response; // 이미 BaseResponse 또는 DataResponse 형식인 경우 그대로 반환
                    }
                    return {
                        success: true, // 기본적으로 성공 응답으로 간주
                        data: response,
                    };
                }),
            );
    }
}
