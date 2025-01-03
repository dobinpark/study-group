import api from './api';
import { ApiResponse } from '../types/api';

interface SignUpData {
  email: string;
  username: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    isAdmin: boolean;
  };
}

export const authService = {
  // 회원가입
  signUp: (data: SignUpData) =>
    api.post<ApiResponse<AuthResponse>>('/auth/signup', data),

  // 로그인
  signIn: (data: SignInData) =>
    api.post<ApiResponse<AuthResponse>>('/auth/signin', data),

  // 로그아웃
  signOut: () => {
    window.localStorage.removeItem('token');
  },
};
