import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error | null, user: any) => void): void {
        done(null, {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
            role: user.role,
        });
    }

    deserializeUser(payload: any, done: (err: Error | null, payload: any) => void): void {
        done(null, payload);
    }
}
