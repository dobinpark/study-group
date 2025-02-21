import { createStore } from 'vuex';
import { authService, studyGroupService } from '../services/api.service';

export default createStore({
  state: {
    user: null,
    studyGroups: [],
    currentStudyGroup: null,
    loading: false,
    error: null
  },

  mutations: {
    setUser(state: any, user: any) {
      state.user = user;
    },
    setStudyGroups(state: any, studyGroups: any) {
      state.studyGroups = studyGroups;
    },
    setCurrentStudyGroup(state: any, studyGroup: any) {
      state.currentStudyGroup = studyGroup;
    },
    setLoading(state: any, loading: any) {
      state.loading = loading;
    },
    setError(state: any, error: any) {
      state.error = error;
    }
  },

  actions: {
    async login({ commit }: any, { username, password }: any) {
      try {
        commit('setLoading', true);
        const response = await authService.login(username, password);
        commit('setUser', response.user);
        return response;
      } catch (error: any) {
        commit('setError', error.response?.data?.message || '로그인 실패');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchStudyGroups({ commit }: any, params: any) {
      try {
        commit('setLoading', true);
        const response = await studyGroupService.getStudyGroups(params);
        commit('setStudyGroups', response.data.items);
        return response;
      } catch (error: any) {
        commit('setError', error.response?.data?.message || '스터디 그룹 조회 실패');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    }
    // ... 기타 액션들
  }
});
