import 'express-session';
import { User } from './src/user/entities/user.entity'; // Import your User entity

declare module 'express-session' {
    interface SessionData {
        passport: {
            user: User['id']; // Or the actual type of your user ID if it's not User['id']
        };
    }
}
