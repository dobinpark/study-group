import { defineStore } from 'pinia';
import axios from '../utils/axios';
import { AxiosError } from 'axios';
import router from '../router';
import { useUserStore } from './user';
import { User as UserModel } from '../types/models';
import { useRouter } from 'vue-router';

// 인증 상태 저장소 상태 타입 정의
interface AuthState {
  isAuthenticated: boolean; // 로그인 상태
  isLoading: boolean; // 로딩 상태
  sessionChecked: boolean; // 세션 체크 상태
  user: UserModel | null;
  error: any;
}

// 인증 상태 저장소 정의
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
    user: null,
    error: null,
  }),

  getters: {
    userId: (state) => state.user?.id,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    // 세션 체크
    checkSession() {
      console.log('AuthStore: checkSession 액션 호출 시작'); // ✅ 세션 체크 시작 로그
      return new Promise(async (resolve, reject) => {
        try {
          console.log('AuthStore: checkSession - axios.get(/auth/session) 요청'); // ✅ axios 요청 로그
          await axios.get('/auth/session');
          this.isAuthenticated = true;
          this.sessionChecked = true;
          console.log('AuthStore: 세션 유효, 로그인 상태 유지 - checkSession 성공'); // ✅ 세션 유효 로그
          console.log('AuthStore: checkSession - document.cookie 값:', document.cookie); // ✅ 쿠키 값 로그 추가
          resolve(true);
        } catch (error: any) {
          this.isAuthenticated = false;
          this.sessionChecked = true;
          console.log('AuthStore: 세션 유효하지 않음, 로그아웃 상태 - checkSession 실패', error); // ✅ 세션 무효 로그
          reject(false);
        } finally {
          console.log('AuthStore: checkSession 액션 완료 (finally)'); // ✅ finally 로그
        }
      });
    },

    // 로그인
    async login(username: string, password: string) {
      console.log('AuthStore: login 액션 시작', { username, password });
      this.isLoading = true;
      try {
        const response = await axios.post('/auth/login', { username, password });

        if (response.status === 200 && response.data.success === true) {
          this.isAuthenticated = true;
          let userFromResponse = null; // 사용자 정보 변수 선언
          // API 응답 데이터 구조에 따라 사용자 정보 추출 방식 수정 (data 안에 user 정보가 있을 경우)
          if (response.data.data && response.data.data.user) {
            userFromResponse = response.data.data.user; // <--- 수정: response.data.data.user 에서 user 정보 추출 시도
          } else if (response.data.user) {
            userFromResponse = response.data.user; // 기존 방식: response.data.user 에 user 정보가 있을 경우
          }
          else {
            console.warn('AuthStore: 로그인 API 응답에 user 정보가 없습니다.', response.data);
            userFromResponse = response.data; // 최후의 수단: response.data 전체를 user 로 사용
          }

          this.user = userFromResponse; // 사용자 정보 할당
          console.log('AuthStore: login 액션 - API 응답 user 정보:', userFromResponse); // ✅ 로그 추가
          console.log('AuthStore: login 액션 - document.cookie 값:', document.cookie); // ✅ 쿠키 값 로그 추가

          if (!this.user) {
            console.error('AuthStore: user 정보 추출 실패. API 응답 구조를 확인하세요.', response.data);
          }

          this.sessionChecked = true;
          console.log('AuthStore: 로그인 성공', this.isAuthenticated, this.user);
          console.log('AuthStore: isAuthenticated 상태 변경: true');
          console.log('AuthStore: sessionChecked 상태 변경: true (로그인 성공)');

          const userStore = useUserStore();
          if (this.user) {
            userStore.setUser(this.user);
          }

          return true;
        } else {
          console.log('AuthStore: 로그인 실패 (API 응답 오류)', response.status, response.data);
          this.isAuthenticated = false;
          this.user = null;
          console.log('AuthStore: isAuthenticated 상태 변경: false');
          return false; // 로그인 실패 시 false 반환
        }
      } catch (error: any) {
        this.isAuthenticated = false;
        this.user = null;
        console.error('AuthStore: 로그인 에러', error);
        console.log('AuthStore: isAuthenticated 상태 변경: false');
        if (error instanceof Error) {
          console.error('AuthStore: 로그인 에러 메시지', error.message);
        } else {
          console.error('AuthStore: 알 수 없는 로그인 에러', error);
        }
        throw error;
      } finally {
        this.isLoading = false;
        console.log('AuthStore: login 액션 완료, isLoading:', this.isLoading, 'isAuthenticated:', this.isAuthenticated, 'sessionChecked:', this.sessionChecked);
      }
    },

    // 로그아웃
    async logout() {
      console.log('AuthStore: logout 액션 시작');
      this.isLoading = true;
      try {
        await axios.post('/auth/logout');
        this.isAuthenticated = false;
        this.user = null;
        this.sessionChecked = false;
        console.log('AuthStore: 로그아웃 성공', this.isAuthenticated);
        console.log('AuthStore: isAuthenticated 상태 변경: false');
        console.log('AuthStore: sessionChecked 상태 변경: false (로그아웃)');

        const userStore = useUserStore();
        userStore.clearUser();

        this.$reset();
        console.log('AuthStore: persist 상태 초기화 완료');

        await router.push('/login');
      } catch (error: any) {
        console.error('AuthStore: 로그아웃 에러', error);
      } finally {
        this.isLoading = false;
        console.log('AuthStore: logout 액션 완료, isLoading:', this.isLoading, 'isAuthenticated:', this.isAuthenticated, 'sessionChecked:', this.sessionChecked);
      }
    },

    setUser(userData: UserModel) {
      this.user = userData;
      this.isAuthenticated = true;
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },

    // 세션 갱신
    async refreshSession() {
      try {
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
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth-session',
        storage: localStorage,
      },
    ],
  },
});
