import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../types/response.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // 상세 에러 메시지 추출
        const message = this.extractErrorMessage(exception);
        
        // 개발 환경에서만 스택 트레이스 포함
        const stack = process.env.NODE_ENV !== 'production' 
            ? this.extractStackTrace(exception)
            : undefined;

        // 에러 로깅
        this.logError(request, exception, status, message);

        const errorResponse: ErrorResponse = {
            success: false,
            statusCode: status,
            error: message,
            path: request.url,
            timestamp: new Date().toISOString(),
            ...(stack && { stack })
        };

        response.status(status).json(errorResponse);
    }

    private extractErrorMessage(exception: unknown): string {
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'object' && response !== null) {
                if ('message' in response && response.message) {
                    if (Array.isArray(response.message)) {
                        return response.message.join(', ');
                    }
                    return String(response.message);
                }
            }
            return exception.message;
        }
        
        if (exception instanceof Error) {
            return exception.message;
        }
        
        return '서버 내부 오류가 발생했습니다.';
    }

    private extractStackTrace(exception: unknown): string | undefined {
        if (exception instanceof Error) {
            return exception.stack;
        }
        return undefined;
    }

    private logError(request: any, exception: unknown, status: number, message: string): void {
        const logContext = {
            method: request.method,
            url: request.url,
            ip: request.ip,
            status,
            userId: request.session?.user?.id || 'anonymous'
        };

        if (status >= 500) {
            this.logger.error(
                `${request.method} ${request.url} ${status}: ${message}`,
                exception instanceof Error ? exception.stack : '',
                logContext
            );
        } else {
            this.logger.warn(
                `${request.method} ${request.url} ${status}: ${message}`,
                logContext
            );
        }
    }
} 