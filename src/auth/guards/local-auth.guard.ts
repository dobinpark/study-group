import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('LocalAuthGuard canActivate 시작');
    try {
      // LocalStrategy를 실행하여 인증 시도
      const result = (await super.canActivate(context)) as boolean;
      this.logger.debug(`LocalStrategy 인증 결과: ${result}`);
      
      if (result) {
        const request = context.switchToHttp().getRequest();
        // 세션에 사용자 정보 저장 (로그인 유지)
        this.logger.debug('로그인 시도');
        await super.logIn(request);
        this.logger.debug('로그인 성공');
      }
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      this.logger.error(`인증 오류: ${errorMessage}`);
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }
} 