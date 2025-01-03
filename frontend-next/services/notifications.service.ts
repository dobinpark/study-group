import api from './api';
import { ApiResponse } from '../types/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INQUIRY_ANSWERED' | 'NEW_INQUIRY' | 'SCHEDULE';
  relatedId: string;
  createdAt: string;
  read: boolean;
}

export const notificationsService = {
  getUnread: () => 
    api.get<ApiResponse<Notification[]>>('/notifications/unread'),

  markAsRead: (id: string) =>
    api.patch<ApiResponse<void>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<ApiResponse<void>>('/notifications/read-all'),
}; 