import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        if (request.session['userId']) { // 세션에 userId 가 있는지 확인하여 로그인 상태 판단
            return true; // 세션이 있으면 (로그인 상태) true 반환, 다음 핸들러 (컨트롤러 메소드) 실행
        }
        throw new UnauthorizedException('User not logged in'); // 세션이 없으면 (로그아웃 상태) UnauthorizedException 발생
    }
}
