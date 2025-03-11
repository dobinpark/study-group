import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    private readonly logger = new Logger(SessionSerializer.name);

    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
        super();
    }

    serializeUser(user: User, done: (err: Error | null, user: number) => void): any {
        this.logger.debug('SessionSerializer - serializeUser 호출');
        done(null, user.id);
    }

    async deserializeUser(userId: number, done: (err: Error | null, user: User | null) => void): Promise<any> {
        this.logger.debug(`SessionSerializer - deserializeUser 호출, userId: ${userId}`);
        try {
            const user = await this.userService.findUserById(userId);
            this.logger.debug(`SessionSerializer - deserializeUser 완료, 사용자 찾음: ${user ? user.username : '없음'}`);
            this.logger.debug(`SessionSerializer - deserializeUser - 반환 사용자 객체: ${JSON.stringify(user)}`);
            done(null, user);
        } catch (error) {
            this.logger.error('SessionSerializer - deserializeUser 중 오류 발생', error);
            done(error instanceof Error ? error : new Error('Deserialize Error'), null);
        }
    }
}
