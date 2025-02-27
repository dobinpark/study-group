import { User } from '../../user/entities/user.entity';

export type SessionUser = Omit<User, 'password'>;
