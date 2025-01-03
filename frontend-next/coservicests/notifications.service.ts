import api from './api';
import { ApiResponse } from '../types/api';
import { NotificationType } from '../types/notification.types';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId: string;
  createdAt: Date;
}

export const notificationsService = {
  getUnread: () => 
    api.get<ApiResponse<Notification[]>>('/notifications'),

  markAsRead: (id: string) =>
    api.patch<ApiResponse<void>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<ApiResponse<void>>('/notifications/read-all'),
}; 