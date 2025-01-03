import 'next-auth';
import 'next-auth/jwt';
import type { User as CustomUser } from './user';

declare module 'next-auth' {
  interface User extends CustomUser {
  }

  interface Session {
    user: CustomUser;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: CustomUser;
    accessToken?: string;
  }
} 