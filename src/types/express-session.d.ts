import { SessionUser } from '../user/types';

declare module 'express-session' {
    interface SessionData {
        user: SessionUser;
    }
}
