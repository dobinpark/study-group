import { defineStore } from 'pinia';
import type { User } from '../types/models';
import axios from '../utils/axios';
import { PersistOptions } from 'pinia-plugin-persist';
import type { LoginDto } from '../types/dto';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isAuthenticated: (state): boolean => state.isLoggedIn
  },

  actions: {
    async login(credentials: LoginDto): Promise<boolean> {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('로그인 요청 URL:', `${axios.defaults.baseURL}/auth/login`);
        const response = await axios.post('/auth/login', credentials);
        
        if (response.data.success) {
          this.user = response.data.data;
          this.isLoggedIn = true;
          return true;
        } else {
          this.error = response.data.message || '로그인에 실패했습니다';
          return false;
        }
      } catch (error: any) {
        console.error('로그인 에러:', error);
        this.error = error.response?.data?.message || '로그인 중 오류가 발생했습니다';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<void> {
      try {
        await axios.post('/auth/logout', {}, {
          withCredentials: true
        });
      } finally {
        this.$patch({
          user: null,
          isLoggedIn: false
        });
      }
    },

    async checkAuth(): Promise<void> {
      try {
        const response = await axios.get<{ data: { isAuthenticated: boolean; user: User | null } }>('/auth/session', {
          withCredentials: true
        });

        const { isAuthenticated, user } = response.data.data;
        this.$patch({
          isLoggedIn: isAuthenticated,
          user: user
        });
      } catch {
        this.$patch({
          isLoggedIn: false,
          user: null
        });
      }
    }
  },

  persist: {
    key: 'user-store',
    storage: () => localStorage,
    enabled: true
  } as PersistOptions
});
