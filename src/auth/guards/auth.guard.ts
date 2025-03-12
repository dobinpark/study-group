import { Injectable, UnauthorizedException, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AuthGuard extends NestAuthGuard('session') {
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.debug(`AuthGuard - canActivate 시작`);
        const request: Request = context.switchToHttp().getRequest();

        this.logger.debug(`AuthGuard - request.isAuthenticated(): ${request.isAuthenticated()}`);
        this.logger.debug(`AuthGuard - request.user (canActivate 시작 시): ${JSON.stringify(request.user)}`);

        if (!request.isAuthenticated()) {
            this.logger.debug(`AuthGuard - 인증 실패: isAuthenticated() === false`);
            return false; // 인증 실패
        }

        this.logger.debug(`AuthGuard - 인증 성공: isAuthenticated() === true`);

        this.logger.debug(`AuthGuard - canActivate 최종 반환: true`);
        return true;
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: any) {
        console.log('AuthGuard - handleRequest 시작!');
        this.logger.debug(`AuthGuard - handleRequest - 에러: ${JSON.stringify(err)}`);
        this.logger.debug(`AuthGuard - handleRequest - user 인자 (handleRequest 시작 시): ${JSON.stringify(user)}`);
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
