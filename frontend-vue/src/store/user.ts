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
        this.user = response.user;
        this.isLoggedIn = true;
        return true;
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
      }
    },

    async checkAuth() {
      this.setLoading(true);
      try {
        const response = await authService.checkSession();
        this.isLoggedIn = response.isAuthenticated;
        this.user = response.user;
      } catch (error) {
        this.logout();
      } finally {
        this.setLoading(false);
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
        paths: ['isLoggedIn', 'user']
      }
    ]
  }
});
