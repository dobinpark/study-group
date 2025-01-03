import api from './api';
import { ApiResponse } from '../types/api';
import type { Inquiry } from '../types/inquiry';
import { User } from '../types/user';
import axios from 'axios';

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export const inquiriesService = {
  getAll: (page: number, limit: number, search: string, filter: string, sort: string) =>
    axios.get<ApiResponse<{ inquiries: Inquiry[] }>>('/api/inquiries', {
      params: { page, limit, search, filter, sort }
    }),

  getOne: (id: string) =>
    api.get<ApiResponse<Inquiry>>(`/inquiries/${id}`),

  create: (formData: FormData) =>
    api.post<ApiResponse<Inquiry>>('/inquiries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  update: (id: string, formData: FormData) =>
    api.patch<ApiResponse<Inquiry>>(`/inquiries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/inquiries/${id}`),

  addComment: (inquiryId: string, content: string) =>
    api.post<ApiResponse<Comment>>(`/inquiries/${inquiryId}/comments`, { content }),

  updateComment: (inquiryId: string, commentId: string, content: string) =>
    api.patch<ApiResponse<Comment>>(`/inquiries/${inquiryId}/comments/${commentId}`, { content }),

  deleteComment: (inquiryId: string, commentId: string) =>
    api.delete<ApiResponse<void>>(`/inquiries/${inquiryId}/comments/${commentId}`),

  answer: (id: string, answer: string) =>
    axios.post<ApiResponse<Inquiry>>(`/api/inquiries/${id}/answer`, { answer }),

  deleteAttachment: (inquiryId: string, attachmentId: string) =>
    axios.delete<ApiResponse<void>>(`/api/inquiries/${inquiryId}/attachments/${attachmentId}`),
};

export type { Inquiry }; 