import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    private readonly logger = new Logger(SessionSerializer.name);

    constructor(private readonly userService: UserService) {
        super();
    }

    serializeUser(user: User, done: (err: Error | null, userId: User['id']) => void): void {
        this.logger.debug(`[serializeUser] 사용자 직렬화 시작 - userId: ${user.id}`);
        done(null, user.id);
        this.logger.debug(`[serializeUser] 사용자 직렬화 완료 - userId: ${user.id}`);
    }

    async deserializeUser(userId: User['id'], done: (err: Error | null, user: User | null) => void): Promise<void> {
        this.logger.debug(`[deserializeUser] 🚀🚀🚀 사용자 역직렬화 시작 - userId: ${userId} 🚀🚀🚀`); // ✅ 시작 로그 (화려하게 강조)
        try {
            this.logger.debug(`[deserializeUser] 사용자 ID 검색 시작: ${userId}`);
            const user = await this.userService.findUserById(userId);
            if (!user) {
                this.logger.warn(`[deserializeUser] 사용자 ID ${userId}로 사용자 찾을 수 없음`);
                this.logger.debug(`[deserializeUser] done(null, null) 호출`); // ✅ done(null, null) 호출 로그
                return done(null, null);
            }

            this.logger.debug(`[deserializeUser] ✅ 사용자 찾음: ${user.username}`); // ✅ 사용자 찾음 로그 (강조)
            this.logger.debug(`[deserializeUser] done(null, user) 호출 - 사용자 정보: ${user.username}`); // ✅ done(null, user) 호출 로그
            done(null, user);
            this.logger.debug(`[deserializeUser] done(null, user) 호출 완료`); // ✅ done(null, user) 완료 로그

        } catch (error) {
            this.logger.error(`[deserializeUser] ❌ 사용자 역직렬화 중 오류 발생: ${(error as Error).message}`, error); // ✅ 오류 로그 (강조)
            this.logger.debug(`[deserializeUser] done(error, null) 호출 - error: ${(error as Error).message}`); // ✅ done(error, null) 호출 로그
            done(error as Error, null);
        } finally {
            this.logger.debug(`[deserializeUser] 🏁🏁🏁 사용자 역직렬화 완료 (finally 블록) - userId: ${userId} 🏁🏁🏁`); // ✅ 종료 로그 (화려하게 강조)
        }
    }
}
