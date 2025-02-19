import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../types/response.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = 
            exception instanceof HttpException
                ? exception.message
                : '서버 내부 오류가 발생했습니다.';

        const errorResponse: ErrorResponse = {
            success: false,
            statusCode: status,
            error: message,
        };

        response.status(status).json(errorResponse);
    }
} 