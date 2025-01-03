import api from './api';
import { ApiResponse } from '../types/api';
import { StudyGroup } from '../types/study-group';

export const studyGroupsService = {
  getAll: () => 
    api.get<ApiResponse<StudyGroup[]>>('/study-groups'),

  getOne: (id: string) => 
    api.get<ApiResponse<StudyGroup>>(`/study-groups/${id}`),

  create: (data: {
    name: string;
    description: string;
    maxMembers: number;
    region: string;
    category: string;
    purpose: string;
  }) => 
    api.post<ApiResponse<StudyGroup>>('/study-groups', data),

  join: (groupId: string) =>
    api.post<ApiResponse<void>>(`/study-groups/${groupId}/join`),

  leave: (groupId: string) =>
    api.post<ApiResponse<void>>(`/study-groups/${groupId}/leave`),
}; 