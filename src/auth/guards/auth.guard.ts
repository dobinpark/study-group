import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportGuard('session') {
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        this.logger.debug(`[AuthGuard] canActivate - request.user (호출 전 super): ${JSON.stringify(request.user)}`);

        this.logger.debug(`[AuthGuard] canActivate - request.user (호출 후 super): ${JSON.stringify(request.user)}`);

        if (request.user) {
            this.logger.debug('[AuthGuard] canActivate - ✅ AuthGuard 통과 (request.user 기반, super 제거)');
            return true;
        } else {
            this.logger.warn('[AuthGuard] canActivate - ❌ AuthGuard 실패 (request.user 없음, super 제거)');
            throw new UnauthorizedException('인증되지 않은 사용자입니다.');
        }
    }
}