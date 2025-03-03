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

        if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`[요청] ${method} ${url}`);
            if (body && Object.keys(body).length > 0) {
                this.logger.debug(`요청 본문: ${JSON.stringify(body, null, 2)}`);
            }
            
            // 세션 정보 로깅 (개발 환경에서만)
            if (req.session) {
                this.logger.debug(`세션 정보: ${JSON.stringify({
                    id: req.session.id,
                    user: req.session.user ? { id: req.session.user.id } : null,
                    expires: req.session.cookie.expires
                }, null, 2)}`);
            }
        }

        return next.handle().pipe(
            tap((data) => {
                const response = context.switchToHttp().getResponse();
                const delay = Date.now() - now;
                this.logger.log(
                    `${method} ${url} ${response.statusCode} ${delay}ms - ${ip} ${userAgent}`
                );
                if (process.env.NODE_ENV === 'development') {
                    if (response.statusCode >= 400) {
                        this.logger.error(`오류 응답: ${JSON.stringify(data, null, 2)}`);
                        if (body && Object.keys(body).length > 0) {
                            this.logger.error(`실패한 요청 본문: ${JSON.stringify(body, null, 2)}`);
                        }
                    } else {
                        this.logger.debug(`Response: ${JSON.stringify(data)}`);
                    }
                }
            }),
        );
    }
}
