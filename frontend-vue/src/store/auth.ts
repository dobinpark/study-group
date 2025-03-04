import { defineStore } from 'pinia';
import axios from '../utils/axios';
import { AxiosError } from 'axios';
import router from '../router';
import { useUserStore } from './user';

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
  }),
  
  actions: {
    async checkSession() {
      this.isLoading = true;
      
      try {
        const response = await axios.get('/auth/session');
        
        if (response.data.success) {
          this.isAuthenticated = true;

          // 사용자 정보가 있으면 userStore에 설정
          if (response.data.data?.user) {
            const userStore = useUserStore();
            userStore.setUser(response.data.data.user);
          }
        } else {
          this.sessionChecked = true;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('세션 확인 중 오류:', error);
        this.isAuthenticated = false;
      } finally {
        this.isLoading = false;
        this.sessionChecked = true;
      }
    },
    
    async login(username: string, password: string) {
      this.isLoading = true;
      try {
        const response = await axios.post('/auth/login', { username, password });
        
        if (response.data?.success && response.data?.data?.user) {
          this.isAuthenticated = true;
          this.sessionChecked = true;
          
          // 사용자 정보 저장은 userStore에 위임
          const userStore = useUserStore();
          userStore.setUser(response.data.data.user);
          
          return true;
        }
        return false;
      } catch (error) {
        console.error('로그인 오류:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async logout() {
      this.isLoading = true;
      try {
        await axios.post('/auth/logout');
        this.isAuthenticated = false;
        
        // 사용자 정보 초기화는 userStore에 위임
        const userStore = useUserStore();
        userStore.clearUser();
        
        // 로그아웃 후 홈으로 이동
        await router.push('/');
      } catch (error) {
        console.error('로그아웃 오류:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // 인증 상태 수동 설정
    setAuthenticated(status: boolean) {
      this.isAuthenticated = status;
    },
    
    // 세션 체크 리셋 (필요한 경우에만 호출)
    resetSessionCheck() {
      this.sessionChecked = false;
    },
    
    // 세션 재활성화 메서드 추가
    async refreshSession() {
      try {
        // 이미 갱신 중인 경우 중복 요청 방지
        if (this.isLoading) {
          return false;
        }
        
        this.isLoading = true;
        
        const response = await axios.post('/auth/refresh', {}, {
          withCredentials: true
        });
        
        if (response.data.success) {
          this.isAuthenticated = true;
          if (response.data.data?.user) {
            const userStore = useUserStore();
            userStore.setUser(response.data.data.user);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('세션 갱신 실패:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
