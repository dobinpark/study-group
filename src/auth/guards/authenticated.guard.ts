import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    
    // 세션 만료 시간 확인 (선택적)
    const now = Date.now();
    if (request.session.cookie.expires && new Date(request.session.cookie.expires).getTime() < now) {
      throw new UnauthorizedException('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    // 세션 활성화 시간 갱신
    request.session.touch();
    
    return true;
  }
}
