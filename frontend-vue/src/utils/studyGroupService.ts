import axios from './axios';
import type { StudyGroup, JoinRequest } from '../types/models';
import { AxiosResponse } from 'axios';

/**
 * 스터디 그룹 관련 API 서비스
 */
export const studyGroupService = {
  /**
   * 스터디 그룹 목록을 가져옵니다.
   */
  async getStudyGroups(params?: any) {
    const response = await axios.get('/study-groups', { params });
    return response.data;
  },

  /**
   * 스터디 그룹 상세 정보를 가져옵니다.
   */
  async getStudyGroup(id: number) {
    const response = await axios.get(`/study-groups/${id}`);
    return response.data;
  },

  /**
   * 새 스터디 그룹을 생성합니다.
   */
  async createStudyGroup(studyGroup: Partial<StudyGroup>) {
    const response = await axios.post('/study-groups', studyGroup);
    return response.data;
  },

  /**
   * 스터디 그룹 정보를 수정합니다.
   */
  async updateStudyGroup(id: number, studyGroup: Partial<StudyGroup>) {
    const response = await axios.put(`/study-groups/${id}`, studyGroup);
    return response.data;
  },

  /**
   * 스터디 그룹을 삭제합니다.
   */
  async deleteStudyGroup(id: number) {
    const response = await axios.delete(`/study-groups/${id}`);
    return response.data;
  },

  /**
   * 스터디 그룹에 참여 요청을 보냅니다.
   */
  async joinStudyGroup(studyGroupId: number, joinRequest: { reason: string, experience: string }) {
    const response = await axios.post(`/study-groups/${studyGroupId}/join-requests`, joinRequest);
    return response.data;
  },

  /**
   * 사용자가 생성한 스터디 그룹의 대기 중인 참여 요청을 가져옵니다.
   */
  async getPendingJoinRequests() {
    const response = await axios.get('/study-groups/join-requests/pending');
    return response.data;
  },

  /**
   * 참여 요청을 승인합니다.
   */
  async approveJoinRequest(studyGroupId: number, requestId: number): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`/study-groups/${studyGroupId}/join-requests/${requestId}/approve`);
      return response;
    } catch (error) {
      console.error('참여 요청 승인 실패:', error);
      throw error;
    }
  },

  /**
   * 참여 요청을 거절합니다.
   */
  async rejectJoinRequest(studyGroupId: number, requestId: number): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`/study-groups/${studyGroupId}/join-requests/${requestId}/reject`);
      return response;
    } catch (error) {
      console.error('참여 요청 거절 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자의 스터디 참여 요청 상태를 확인합니다.
   */
  async checkJoinRequestStatus(studyGroupId: number) {
    const response = await axios.get(`/study-groups/${studyGroupId}/join-requests/status`);
    return response.data;
  }
};

export default studyGroupService;