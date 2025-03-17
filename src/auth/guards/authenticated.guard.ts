import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Passport.js의 isAuthenticated() 메서드를 사용하여 인증 여부 확인
        return request.isAuthenticated();
    }
}
