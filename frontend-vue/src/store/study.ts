import { defineStore } from 'pinia';
import type { StudyGroup } from '../types/models';
import { studyGroupService } from '../services/api.service';

interface StudyState {
  studyGroups: StudyGroup[];
  currentStudyGroup: StudyGroup | null;
  loading: boolean;
  error: string | null;
}

export const useStudyStore = defineStore('study', {
  state: (): StudyState => ({
    studyGroups: [],
    currentStudyGroup: null,
    loading: false,
    error: null
  }),

  getters: {
    getStudyGroups: (state) => state.studyGroups,
    getCurrentStudyGroup: (state) => state.currentStudyGroup,
    isLoading: (state) => state.loading
  },

  actions: {
    setLoading(status: boolean) {
      this.loading = status;
    },

    setError(error: string | null) {
      this.error = error;
    },

    async fetchStudyGroups(params?: any) {
      this.setLoading(true);
      try {
        const response = await studyGroupService.getStudyGroups(params);
        this.studyGroups = response.data.items;
        return response;
      } catch (error: any) {
        this.setError(error.response?.data?.message || '스터디 그룹 조회에 실패했습니다');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchStudyGroup(id: number) {
      this.setLoading(true);
      try {
        const response = await studyGroupService.getStudyGroup(id);
        this.currentStudyGroup = response.data;
        return response.data;
      } catch (error: any) {
        this.setError(error.response?.data?.message || '스터디 그룹 상세 조회에 실패했습니다');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async createStudyGroup(data: Partial<StudyGroup>) {
      this.setLoading(true);
      try {
        const response = await studyGroupService.createStudyGroup(data);
        return response.data;
      } catch (error: any) {
        this.setError(error.response?.data?.message || '스터디 그룹 생성에 실패했습니다');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async updateStudyGroup(id: number, data: Partial<StudyGroup>) {
      this.setLoading(true);
      try {
        const response = await studyGroupService.updateStudyGroup(id, data);
        if (this.currentStudyGroup?.id === id) {
          this.currentStudyGroup = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.setError(error.response?.data?.message || '스터디 그룹 수정에 실패했습니다');
        throw error;
      } finally {
        this.setLoading(false);
      }
    }
  }
}); 