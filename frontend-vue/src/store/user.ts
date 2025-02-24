import { defineStore } from 'pinia';
import type { User } from '../types/models';
import { authService } from '../services/api.service';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn,
    hasError: (state) => !!state.error
  },

  actions: {
    setLoading(status: boolean) {
      this.loading = status;
    },

    setError(error: string | null) {
      this.error = error;
    },

    async login(credentials: { username: string; password: string }) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await authService.login(credentials);
        if (response && response.user) {
          this.user = response.user;
          this.isLoggedIn = true;
          return true;
        }
        return false;
      } catch (error: any) {
        this.setError(error.response?.data?.message || '로그인에 실패했습니다');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async logout() {
      try {
        await authService.logout();
      } finally {
        this.user = null;
        this.isLoggedIn = false;
        localStorage.removeItem('user-store');
      }
    },

    async checkAuth() {
      this.setLoading(true);
      try {
        const response = await authService.checkSession();
        console.log('Check auth response:', response);
        
        // 에러로 인한 null 응답 시 기존 상태 유지
        if (response === null) {
          console.log('Keeping existing auth state due to error');
          return;
        }
        
        // 세션이 유효하면 상태 업데이트
        if (response.isAuthenticated && response.user) {
          console.log('Session valid, updating state');
          this.isLoggedIn = true;
          this.user = response.user;
        } else if (this.isLoggedIn) {
          // 세션이 유효하지 않고 현재 로그인 상태라면 유지
          console.log('Session invalid but keeping existing state');
        }
      } catch (error) {
        console.error('Check auth error:', error);
        // 에러 시에도 기존 상태 유지
      } finally {
        this.setLoading(false);
      }
    },

    initializeFromStorage() {
      const stored = localStorage.getItem('user-store');
      if (stored) {
        const { user, isLoggedIn } = JSON.parse(stored);
        this.user = user;
        this.isLoggedIn = isLoggedIn;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['user', 'isLoggedIn']
      }
    ]
  }
});
