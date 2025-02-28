import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        console.log('SerializeUser 호출됨:', user.id);
        done(null, user.id);
    }

    async deserializeUser(userId: number, done: Function) {
        try {
            const user = await this.authService.findUserById(userId);
            console.log('DeserializeUser 호출됨:', userId, '결과:', !!user);
            if (!user) {
                return done(null, false);
            }
            const { password, ...userWithoutPassword } = user;
            done(null, userWithoutPassword);
        } catch (error) {
            console.error('DeserializeUser 오류:', error);
            done(error);
        }
    }
}
