import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;
        const userEmail = req.user?.email;

        this.logger.log(
            `[Request] ${method} ${url} ${userEmail ? `- User: ${userEmail}` : ''}`,
        );
        if (Object.keys(body).length > 0) {
            this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
        }

        const now = Date.now();
        return next.handle().pipe(
            tap({
                next: (data) => {
                    this.logger.log(`[Response] ${method} ${url} ${Date.now() - now}ms`);
                    this.logger.debug(`Response Body: ${JSON.stringify(data)}`);
                },
                error: (error) => {
                    this.logger.error(
                        `[Error] ${method} ${url} ${Date.now() - now}ms - ${error.message}`,
                    );
                },
            }),
        );
    }
}
