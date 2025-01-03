import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      // 예상치 못한 에러 처리
      response.status(500).json({
        statusCode: 500,
        message: '서버 내부 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
