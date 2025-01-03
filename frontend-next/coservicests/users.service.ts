import api from './api';
import { ApiResponse } from '../types/api';

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const usersService = {
  getProfile: () => 
    api.get<ApiResponse<Profile>>('/users/profile'),

  updateProfile: (formData: FormData) =>
    api.patch<ApiResponse<Profile>>('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<ApiResponse<void>>('/users/password', data),

  deleteAvatar: () =>
    api.delete<ApiResponse<void>>('/users/profile/avatar'),
}; 