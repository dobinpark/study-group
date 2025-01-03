import api from './api';
import { StudyGroup } from '../types/study-group';
import { ApiResponse } from '../types/api';

export const studyGroupsService = {
  // 스터디 그룹 목록 조회
  getAll: () => api.get<ApiResponse<StudyGroup[]>>('/study-groups'),

  // 새 스터디 그룹 생성
  create: (data: { name: string; description: string; maxMembers: number }) => {
    return api.post<ApiResponse<StudyGroup>>('/study-groups', data);
  },

  // 스터디 그룹 가입
  join: (groupId: string) =>
    api.post<ApiResponse<void>>(`/study-groups/${groupId}/join`),

  // 스터디 그룹 탈퇴
  leave: (groupId: string) =>
    api.post<ApiResponse<void>>(`/study-groups/${groupId}/leave`),

  getByRegion: (region: string) =>
    api.get<ApiResponse<StudyGroup[]>>(`/study-groups/region/${region}`),

  getByCategory: (category: string) =>
    api.get<ApiResponse<StudyGroup[]>>(`/study-groups/category/${category}`),

  getByPurpose: (purpose: string) =>
    api.get<ApiResponse<StudyGroup[]>>(`/study-groups/purpose/${purpose}`),

  search: (query: string) =>
    api.get<ApiResponse<StudyGroup[]>>(`/study-groups/search`, {
      params: { query },
    }),
};
