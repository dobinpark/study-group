import { SessionData, Session as ExpressSession } from 'express-session';
import { UserRole, User } from '../user/entities/user.entity';

export interface SessionUser {
    id: number;
    username: string;
    nickname: string;
    role: UserRole;
}

export interface CustomSession extends ExpressSession {
    destroy(callback: (err?: any) => void): this;
    user?: Omit<User, 'password'>;
}
