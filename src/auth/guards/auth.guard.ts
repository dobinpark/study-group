import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportGuard('session') {
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // PassportGuard('session')의 canActivate 실행 (세션 인증 처리)
        const result = await super.canActivate(context);
        this.logger.debug(`super.canActivate(context) 결과: ${result}`); // ✅ 결과 로깅

        // super.canActivate()가 false를 반환하면 UnauthorizedException 발생 (기존 로직 유지)
        if (!result) {
            throw new UnauthorizedException('인증되지 않은 사용자입니다.');
        }

        this.logger.debug(`AuthGuard - request.user: ${JSON.stringify(request.user)}`); // ✅ request.user 로깅
        this.logger.debug(`AuthGuard - request.isAuthenticated(): ${request.isAuthenticated()}`); // ✅ isAuthenticated() 로깅
        this.logger.debug(`AuthGuard - request.session: ${JSON.stringify(request.session)}`); // ✅ request.session 로깅

        if (!request.user) {
            this.logger.error('AuthGuard: request.user가 여전히 null입니다.'); // 🚨 에러 로그 추가
            return false; // 명시적으로 false 반환 (필요한 경우)
        }

        return true; // 인증 성공
    }
}
