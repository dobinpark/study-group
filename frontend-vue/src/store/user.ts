import { defineStore } from 'pinia';
import type { User } from '../types/models';
import axios from 'axios';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoggedIn: false
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isAuthenticated: (state): boolean => state.isLoggedIn
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      try {
        const response = await axios.post<{ success: boolean; data: User }>('/auth/login', credentials, {
          withCredentials: true
        });
        
        if (response.data.success) {
          this.$patch({
            user: response.data.data,
            isLoggedIn: true
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('로그인 실패:', error);
        return false;
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

  persist: true
});
