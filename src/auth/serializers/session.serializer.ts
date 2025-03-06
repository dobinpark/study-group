import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    private readonly logger = new Logger(SessionSerializer.name); // Logger 추가

    constructor(private authService: AuthService) {
        super();
    }

    serializeUser(user: User, done: (err: Error | null, user: any) => void): any {
        this.logger.debug(`serializeUser 호출 - user: ${JSON.stringify(user)}`); // ✅ serializeUser 호출 및 user 객체 로깅
        done(null, user.id); // 사용자 ID만 세션에 저장 (일반적인 방식)
        this.logger.debug(`serializeUser 완료 - userId: ${user.id}`); // ✅ serializeUser 완료 및 userId 로깅
    }

    async deserializeUser(userId: any, done: (err: Error | null, user?: User | null) => void): Promise<any> {
        this.logger.debug(`deserializeUser 호출 - userId: ${userId}`); // ✅ deserializeUser 호출 및 userId 로깅
        try {
            const user = await this.authService.findUserById(userId);
            this.logger.debug(`deserializeUser 조회 결과 - userId: ${userId}, user: ${JSON.stringify(user)}`); // ✅ deserializeUser 조회 결과 로깅
            done(null, user); // 사용자 객체 복원
            this.logger.debug(`deserializeUser 완료 - userId: ${userId}, user: ${user ? user.username : 'null'}`); // ✅ deserializeUser 완료 로그 (username 또는 null)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`deserializeUser 에러 - userId: ${userId}, error: ${errorMessage}`);
            done(error as Error, null);
        }
    }
}
