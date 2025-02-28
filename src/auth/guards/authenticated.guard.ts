import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    if (!request.isAuthenticated()) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }
    
    return true;
  }
} 