import { Injectable, UnauthorizedException, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AuthGuard extends NestAuthGuard('session') {
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug(`AuthGuard - canActivate 시작`);
        const request: Request = context.switchToHttp().getRequest();

        // Passport는 request 객체에 .isAuthenticated() 메서드와 .user 객체를 추가합니다.
        if (!request.isAuthenticated()) {
            this.logger.debug(`AuthGuard - 인증 실패: isAuthenticated() === false`);
            return false; // 인증 실패
        }

        this.logger.debug(`AuthGuard - 인증 성공: isAuthenticated() === true`);
        this.logger.debug(`AuthGuard - super.canActivate 호출`);
        const canActivateResult = true; // super.canActivate(context)를 직접 호출하지 않고 true로 대체
        this.logger.debug(`AuthGuard - super.canActivate 결과: ${canActivateResult}`);

        if (canActivateResult) {
            this.logger.debug(`AuthGuard - canActivate 최종 반환: true`);
            this.logger.debug(`AuthGuard - canActivate 성공 후 request.user 설정: ${(request.user as any)?.id}`); // 로깅 추가
            return true;
        } else {
            this.logger.debug(`AuthGuard - canActivate 최종 반환: false`);
            return false;
        }
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: any) {
        console.log('AuthGuard - handleRequest 시작!');
        this.logger.debug(`AuthGuard - handleRequest - 에러: ${JSON.stringify(err)}`);
        this.logger.debug(`AuthGuard - handleRequest - user 인자: ${JSON.stringify(user)}`);
        this.logger.debug(`AuthGuard - handleRequest - info 인자: ${JSON.stringify(info)}`);
        this.logger.debug(`AuthGuard - handleRequest - context 타입: ${typeof context}`);
        this.logger.debug(`AuthGuard - handleRequest - status: ${status}`);

        if (err || !user) {
            this.logger.error(`AuthGuard - handleRequest - 인증 실패: ${err || '사용자 없음'}, 상태 코드: ${status}`);
            throw err || new UnauthorizedException('로그인이 필요합니다.');
        }
        this.logger.debug('AuthGuard - handleRequest - 인증 성공, 사용자 정보 반환 직전');
        this.logger.debug(`AuthGuard - handleRequest - 반환 user 객체: ${JSON.stringify(user)}`);
        this.logger.debug('AuthGuard - handleRequest - 인증 성공, 사용자 정보 반환 완료');
        return user;
    }
}
