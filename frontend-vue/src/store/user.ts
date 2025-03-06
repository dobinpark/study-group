import { defineStore } from 'pinia';
import axios from '../utils/axios';
import apiClient from '../utils/axios';
import type { User, UserProfile } from '../types/models';
import { useAuthStore } from './auth';
import { PersistOptions } from 'pinia-plugin-persist';

interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: any;
  hasProfile: boolean;
}

export const useUserStore = defineStore<'user', UserState, any, any>('user', {
  state: (): UserState => ({
    user: null,
    userProfile: null,
    isLoading: false,
    error: null,
    hasProfile: false
  }),

  getters: {
    // 사용자 정보 관련 getters
    userId: (state: UserState) => state.user?.id,
    userName: (state: UserState) => state.user?.username,
    userEmail: (state: UserState) => state.user?.email,
    userRole: (state: UserState) => state.user?.role,
    isAdmin: (state: UserState) => state.user?.role === 'admin',
    isLoggedIn: (state: UserState) => !!state.user,

    // 사용자 프로필 정보
    profile: (state: UserState) => ({
      name: state.user?.nickname || state.user?.username,
      email: state.user?.email,
      bio: (state.user as any)?.bio || '',
      profileImage: (state.user as any)?.profileImage || '',
      createdAt: (state.user as any)?.createdAt
    })
  },

  actions: {
    // 사용자 정보 설정
    setUser(userData: User) {
      this.user = userData;
    },

    // 사용자 정보 초기화
    clearUser() {
      this.user = null;
      this.userProfile = null;
    },

    // 사용자 프로필 가져오기
    async fetchUserProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`/users/profile/${this.user?.id}`);
        if (response.status === 200 && response.data.success) {
          this.userProfile = response.data.data;
          this.user = response.data.data;
          console.log('UserStore: 프로필 정보 불러오기 성공', this.userProfile);
        } else {
          console.error('UserStore: 프로필 정보 불러오기 실패', response.status, response.data);
          this.error = '프로필 정보를 불러오는데 실패했습니다.';
        }
      } catch (error: any) {
        console.error('UserStore: 프로필 정보 불러오기 에러', error);
        this.error = error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 사용자 프로필 업데이트
    async updateProfile(profileData: Partial<User>) {
      if (!this.user?.id) return false;

      this.isLoading = true;
      try {
        const response = await axios.put(`/users/${this.user.id}/profile`, profileData);

        if (response.data?.success) {
          // 업데이트된 프로필 정보로 user 객체 갱신
          this.user = {
            ...this.user,
            ...response.data.data.user
          };
          return true;
        }
        return false;
      } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // 비밀번호 변경
    async changePassword(currentPassword: string, newPassword: string) {
      if (!this.user?.id) return false;

      try {
        const response = await axios.put(`/users/${this.user.id}/password`, {
          currentPassword,
          newPassword
        });

        return response.data?.success || false;
      } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        return false;
      }
    }
  },

  persist: {
    enabled: true,
  },
});
