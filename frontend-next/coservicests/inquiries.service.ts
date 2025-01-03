import api from './api';
import { ApiResponse } from '../types/api';

export interface Attachment {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  isAnswered: boolean;
  answer?: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: Attachment[];
}

export interface PaginatedInquiries {
  inquiries: Inquiry[];
  total: number;
  totalPages: number;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const inquiriesService = {
  getAll: (
    page: number = 1, 
    limit: number = 10,
    search?: string,
    filter: 'all' | 'answered' | 'pending' = 'all',
    sort: 'latest' | 'oldest' | 'answered' | 'pending' = 'latest',
  ) => 
    api.get<ApiResponse<PaginatedInquiries>>('/inquiries', {
      params: { page, limit, search, filter, sort },
    }),

  getOne: (id: string) =>
    api.get<ApiResponse<Inquiry>>(`/inquiries/${id}`),

  create: (formData: FormData) =>
    api.post<ApiResponse<Inquiry>>('/inquiries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  answer: (id: string, answer: string) =>
    api.patch<ApiResponse<Inquiry>>(`/inquiries/${id}/answer`, { answer }),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/inquiries/${id}`),

  addComment: (inquiryId: string, content: string) =>
    api.post<ApiResponse<Comment>>(`/inquiries/${inquiryId}/comments`, { content }),

  updateComment: (commentId: string, content: string) =>
    api.patch<ApiResponse<Comment>>(`/inquiries/comments/${commentId}`, { content }),

  deleteComment: (commentId: string) =>
    api.delete<ApiResponse<void>>(`/inquiries/comments/${commentId}`),

  update: (id: string, formData: FormData) =>
    api.patch<ApiResponse<Inquiry>>(`/inquiries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteAttachment: (inquiryId: string, attachmentId: string) =>
    api.delete<ApiResponse<void>>(`/inquiries/${inquiryId}/attachments/${attachmentId}`),
}; 