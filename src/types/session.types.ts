import { SessionData, Session as ExpressSession } from 'express-session';
import { UserRole } from '../user/entities/user.entity';
import { UserProfileResponseDto } from '../user/dto/user-profile.response.dto';

export interface SessionUser {
    id: number;
    username: string;
    nickname: string;
    role: UserRole;
}

export interface CustomSession extends ExpressSession {
    destroy(callback: (err?: any) => void): this;
    user?: UserProfileResponseDto;
}
