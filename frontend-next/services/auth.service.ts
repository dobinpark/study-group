import api from '../services/api';
import { ApiResponse } from '../types/api';
import { User } from '../types/user';

interface SignInResponse {
  accessToken: string;
  user: User;
}

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  username: string;
}

export const authService = {
  signIn: (data: SignInData) =>
    api.post<ApiResponse<SignInResponse>>('/auth/signin', data),

  signUp: (data: SignUpData) =>
    api.post<ApiResponse<User>>('/auth/signup', data),

  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};
