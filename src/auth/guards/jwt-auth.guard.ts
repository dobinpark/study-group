import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("JwtAuthGuard - canActivate - 시작");
        
        return Promise.resolve(super.canActivate(context))
            .then((result: any) => {
                console.log("JwtAuthGuard - canActivate - 인증 성공:", result);
                return result;
            })
            .catch((error: any) => {
                console.error("JwtAuthGuard - canActivate - 인증 실패:", error);
                throw new UnauthorizedException();
            })
            .finally(() => {
                console.log("JwtAuthGuard - canActivate - 종료");
            });
    }
}
