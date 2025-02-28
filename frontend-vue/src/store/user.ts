import { defineStore } from 'pinia';
import type { User } from '../types/models';
import axios from '../utils/axios';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  persistMode: 'local' | 'session' | 'none';
}

// 스토어 타입 정의
export interface UserStore extends UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  restoreUserFromStorage: () => void;
  clearUserData: () => void;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    persistMode: 'none'
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isAuthenticated(): boolean {
      return this.isLoggedIn && !!this.user;
    }
  },

  actions: {
async login(username: string, password: string, rememberMe: boolean = false): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/auth/login', { username, password });
        console.log('로그인 응답:', response.data);

        if (response.data.success) {
          const { user } = response.data.data;
          
          this.user = user;
          this.isLoggedIn = true;
          this.persistMode = rememberMe ? 'local' : 'session';

          // 사용자 정보 저장
          const userData = {
            user: this.user,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };

          // 스토리지에 저장
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('user-store', JSON.stringify(userData));
          
          return true;
        } else {
          this.error = response.data.message || '로그인에 실패했습니다';
          return false;
        }
      } catch (error: any) {
        console.error('로그인 실패:', error);
        this.error = error.response?.data?.message || '로그인 중 오류가 발생했습니다';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<boolean> {
      try {
        await axios.post('/auth/logout');
        
        // 사용자 세션 초기화
        this.user = null;
        this.isLoggedIn = false;
        this.persistMode = 'none';

        // 스토리지 초기화
        localStorage.removeItem('user-store');
        sessionStorage.removeItem('user-store');
        
        return true;
      } catch (error) {
        console.error('로그아웃 실패:', error);
        
        // 에러가 발생해도 로컬 상태 초기화
        this.user = null;
        this.isLoggedIn = false;
        localStorage.removeItem('user-store');
        sessionStorage.removeItem('user-store');
        
        return false;
      }
    },

    async checkAuth(): Promise<boolean> {
      this.loading = true;
      
      // 로컬 스토리지나 세션 스토리지에서 사용자 정보 복원
      this.restoreUserFromStorage();
      
      try {
        // 서버에 세션 상태 확인
        const response = await axios.get('/auth/session');
        
        if (response.data.success && response.data.data.isAuthenticated) {
          // 서버 세션이 유효하면 사용자 정보 업데이트
          this.user = response.data.data.user;
          this.isLoggedIn = true;
          
          // 스토리지 업데이트
          if (this.persistMode !== 'none') {
            const userData = {
              user: this.user,
              isLoggedIn: true,
              loginTime: new Date().toISOString()
            };
            
            const storage = this.persistMode === 'local' ? localStorage : sessionStorage;
            storage.setItem('user-store', JSON.stringify(userData));
          }
          
          return true;
        } else {
          // 서버 세션이 유효하지 않으면 로그아웃 상태로 전환
          this.clearUserData();
          // 세션 만료 이벤트 발생
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
          return false;
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        this.clearUserData();
        // 인증 오류 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 스토리지에서 사용자 정보 복원
    restoreUserFromStorage() {
      let storedData = null;
      
      const localData = localStorage.getItem('user-store');
      if (localData) {
        storedData = JSON.parse(localData);
        this.persistMode = 'local';
      } else {
        const sessionData = sessionStorage.getItem('user-store');
        if (sessionData) {
          storedData = JSON.parse(sessionData);
          this.persistMode = 'session';
        }
      }
      
      if (storedData && storedData.isLoggedIn && storedData.user) {
        this.user = storedData.user;
        this.isLoggedIn = true;
      }
    },
    
    // 사용자 데이터 초기화
    clearUserData() {
      this.user = null;
      this.isLoggedIn = false;
      this.persistMode = 'none';
      localStorage.removeItem('user-store');
      sessionStorage.removeItem('user-store');
    }
  },

  persist: {
    enabled: false
  } as any
});
