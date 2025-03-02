import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    private readonly logger = new Logger(SessionSerializer.name);

    constructor(private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        this.logger.debug(`사용자 직렬화 시도: ${user?.id || 'unknown'}`);
        done(null, user.id);
    }

    async deserializeUser(userId: number, done: Function) {
        try {
            this.logger.debug(`사용자 역직렬화 시도: ${userId}`);
            const user = await this.authService.findUserById(userId);
            
            if (!user) {
                this.logger.warn(`사용자 ID를 찾을 수 없음: ${userId}`);
                return done(null, false);
            }
            
            const { password, ...userWithoutPassword } = user;
            this.logger.debug(`사용자 역직렬화 성공: ${userId}`);
            done(null, userWithoutPassword);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`사용자 역직렬화 오류: ${errorMessage}`);
            done(error);
        }
    }
}
