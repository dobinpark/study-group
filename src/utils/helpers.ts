import { Request } from 'express';
import { DataResponse } from '../types/response.types';

export class Helpers {
    /**
     * 성공 응답을 생성합니다.
     */
    static createSuccessResponse<T>(data: T | null = null, message?: string): DataResponse<T> {
        return {
            success: true,
            data,
            ...(message && { message })
        };
    }

    /**
     * 페이지네이션된 성공 응답을 생성합니다.
     */
    static createPaginatedResponse<T>(
        items: T[],
        total: number,
        page: number,
        limit: number
    ): DataResponse<T[]> {
        return {
            success: true,
            data: items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * 요청에서 세션 사용자 ID를 안전하게 추출합니다.
     */
    static getUserIdFromRequest(request: Request): number | null {
        return request.session?.user?.id || null;
    }

    /**
     * 에러 메시지에서 민감한 정보를 제거합니다.
     */
    static sanitizeErrorMessage(message: string): string {
        // 데이터베이스 에러 정보 제거
        message = message.replace(/\b(password|secret|token)\b.*?[:=].*?[,}]/gi, '$1: [REDACTED]');
        
        // SQL 쿼리 제거
        message = message.replace(/SELECT.*?FROM|INSERT.*?INTO|UPDATE.*?SET|DELETE.*?FROM/gi, '[SQL QUERY REDACTED]');
        
        return message;
    }
} 