import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { Session } from 'express-session';

// ✅ passport 속성을 포함하는 Session 인터페이스 정의
interface SessionWithPassport extends Session {
    passport?: {
        user: number;
    };
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
        this.logger.debug('LocalStrategy constructor 호출');
    }

    async validate(req: Request, username: string, password?: string): Promise<any> {
        this.logger.debug(`[LocalStrategy] validate 메서드 호출 - username: ${username}`);
        const user = await this.authService.validateUser(username, password);

        if (!user) {
            this.logger.warn(`[LocalStrategy] validate 메서드 실패: 사용자 인증 실패 - username: ${username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.debug(`[LocalStrategy] validate 메서드 성공: 사용자 인증 성공 - username: ${username}, userId: ${user.id}`);
        this.logger.debug(`[LocalStrategy] validate 메서드 - 인증된 사용자 정보: ${JSON.stringify(user)}`);

        // ✅ req.session 을 SessionWithPassport 타입으로 단언하여 passport 속성 접근
        (req.session as SessionWithPassport).passport = { user: user.id };
        this.logger.debug(`[LocalStrategy] validate 메서드 - session.passport 설정 완료: ${JSON.stringify((req.session as SessionWithPassport).passport)}`);

        // ✅ req.session.save() 호출하여 세션 명시적으로 저장
        req.session.save((err) => {
            if (err) {
                this.logger.error(`[LocalStrategy] session.save() 실패: ${err.message}`, err.stack);
            } else {
                this.logger.debug(`[LocalStrategy] session.save() 성공`);
                this.logger.debug(`[LocalStrategy] session 정보 (save() 직후): ${JSON.stringify(req.session)}`); // ✅ session 정보 로깅 (save() 직후)
            }
        });

        return user;
    }
} 