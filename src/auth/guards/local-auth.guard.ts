import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // LocalStrategy를 실행하여 인증 시도
    const result = (await super.canActivate(context)) as boolean;
    
    if (result) {
      const request = context.switchToHttp().getRequest();
      // 세션에 사용자 정보 저장 (로그인 유지)
      await super.logIn(request);
    }
    
    return result;
  }
} 