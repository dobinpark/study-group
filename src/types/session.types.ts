import { Session } from 'express-session';
import { User } from '../user/entities/user.entity';

// 세션에 저장되는 사용자 정보 타입
export type SessionUser = Omit<User, 'password'>;

// Express 세션 확장 인터페이스
export interface CustomSession extends Session {
  user?: SessionUser;
  passport?: {
    user: number; // 사용자 ID가 저장됨
  };
}
