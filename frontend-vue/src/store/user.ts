import { defineStore } from 'pinia';
import axios from '../utils/axios';

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  nickname?: string;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
}

interface UserState {
  user: User | null;
  isLoadingProfile: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoadingProfile: false
  }),

  getters: {
    // 사용자 정보 관련 getters
    userId: (state) => state.user?.id,
    userName: (state) => state.user?.username,
    userEmail: (state) => state.user?.email,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin',
    isLoggedIn: (state) => !!state.user,

    // 사용자 프로필 정보
    profile: (state) => ({
      name: state.user?.nickname || state.user?.username,
      email: state.user?.email,
      bio: state.user?.bio,
      profileImage: state.user?.profileImage,
      createdAt: state.user?.createdAt
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
    },

    // 사용자 프로필 가져오기
    async fetchUserProfile() {
      if (!this.user?.id) return;

      this.isLoadingProfile = true;
      try {
        const response = await axios.get(`/users/${this.user.id}/profile`);

        if (response.data?.success) {
          // 프로필 정보로 user 객체 업데이트
          this.user = {
            ...this.user,
            ...response.data.data.profile
          };
        }
      } catch (error) {
        console.error('프로필 정보 불러오기 실패:', error);
      } finally {
        this.isLoadingProfile = false;
      }
    },

    // 사용자 프로필 업데이트
    async updateProfile(profileData: Partial<User>) {
      if (!this.user?.id) return false;

      this.isLoadingProfile = true;
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
        this.isLoadingProfile = false;
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
  }
});
