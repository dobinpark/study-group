import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, ip, body } = req;
        const userAgent = req.get('user-agent') || '';
        const now = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const response = context.switchToHttp().getResponse();
                const delay = Date.now() - now;
                this.logger.log(
                    `${method} ${url} ${response.statusCode} ${delay}ms - ${ip} ${userAgent}`
                );
                if (process.env.NODE_ENV === 'development') {
                    this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
                    this.logger.debug(`Response: ${JSON.stringify(data)}`);
                }
            }),
        );
    }
}
