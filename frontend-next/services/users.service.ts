import axios from 'axios';
import { ApiResponse } from '../types/api';
import type { User } from '../types/user';

export interface Profile extends Omit<User, 'isAdmin' | 'createdAt'> {
    bio?: string;
    avatarUrl?: string;
}

export const usersService = {
    getProfile: () =>
        axios.get<ApiResponse<Profile>>('/api/users/profile'),
    updateProfile: (data: FormData) =>
        axios.patch<ApiResponse<Profile>>('/api/users/profile', data),
    deleteAvatar: () =>
        axios.delete<ApiResponse<void>>('/api/users/profile/avatar'),
    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
        axios.patch<ApiResponse<void>>('/api/users/password', data),
}; 