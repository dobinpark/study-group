import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity'; // User 엔티티 import

@Injectable()
export class SessionSerializer extends PassportSerializer {
    private readonly logger = new Logger(SessionSerializer.name);
    constructor(private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: User, done: (err: Error | null, userId: number) => void): void {
        this.logger.debug(`[SessionSerializer] serializeUser 호출, userId: ${user.id}`);
        done(null, user.id); // 세션에 사용자 ID 저장
    }

    async deserializeUser(userId: number, done: (err: Error | null, user: User | null) => void): Promise<void> {
        this.logger.debug(`[SessionSerializer] deserializeUser 호출, userId: ${userId}`);
        this.logger.debug(`[SessionSerializer] deserializeUser - userId 파라미터 타입: ${typeof userId}`);
        try {
            const user = await this.authService.findUserById(userId);
            if (!user) {
                this.logger.warn(`[SessionSerializer] 사용자 ID ${userId}로 사용자 찾을 수 없음`);
                return done(null, null); // 사용자 찾을 수 없으면 null 반환
            }
            this.logger.debug(`[SessionSerializer] deserializeUser 완료, 사용자 찾음: ${user.username}`);
            this.logger.debug(`[SessionSerializer] deserializeUser - 반환 사용자 객체: ${JSON.stringify(user)}`);
            done(null, user); // request.user 에 사용자 객체 설정
        } catch (error: unknown) {
            this.logger.error(`[SessionSerializer] deserializeUser 에러: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, error instanceof Error ? error.stack : undefined);
            done(error instanceof Error ? error : new Error('Unknown error in deserializeUser'), null); // 에러 발생 시 Error 객체 전달
        }
    }
}
