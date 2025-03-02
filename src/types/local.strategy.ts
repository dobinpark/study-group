import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);
    
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        this.logger.debug(`${username} 사용자 인증 시도`);
        try {
            const user = await this.authService.validateUser(username, password);
            if (!user) {
                this.logger.warn(`${username} 인증 실패: 잘못된 사용자 정보`);
                throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
            this.logger.debug(`${username} 인증 성공`);
            return user;
        } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`${username} 인증 오류: ${errorMessage}`);
            throw error;
        }
    }
}
