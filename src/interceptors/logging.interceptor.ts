import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        const now = Date.now();
        const method = req.method;
        const url = req.url;
        const body = req.body;
        const session = req.session;
        const user = req.user;

        this.logger.debug(`[요청] ${method} ${url}`);
        if (Object.keys(body).length > 0) {
            this.logger.debug(`요청 본문: ${JSON.stringify(body)}`);
        }
        this.logger.debug(`세션 정보: ${JSON.stringify(session)}`);
        this.logger.debug(`request.user 정보: ${JSON.stringify(user)}`);

        return next
            .handle()
            .pipe(
                tap((response) => {
                    const responseTime = Date.now() - now;
                    const statusCode = context.switchToHttp().getResponse().statusCode;

                    this.logger.log(`[응답] ${method} ${url} ${statusCode} ${responseTime}ms - ${req.ip} ${req.get('User-Agent')}`);
                    if (response) {
                        this.logger.debug(`Response: ${JSON.stringify(response)}`);
                    }
                }),
            );
    }
}
