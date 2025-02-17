// src/stores/index.ts (useUserStore.ts)
import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { User } from '@/types/user';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    loading: boolean;
    error: Error | null;
    authChecked: boolean;
}

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: null,
        user: null,
        loading: false,
        error: null,
        authChecked: false,
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage,
                paths: ['user', 'accessToken']
            }
        ]
    },
    getters: {
        isLoggedIn: (state) => !!state.accessToken,
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        getErrorMessage: (state) => state.error?.message,
        getAccessToken: (state) => state.accessToken,
        getRefreshToken: (state) => state.refreshToken,
    },
    actions: {
        setLoading(isLoading: boolean): void {
            console.log('useUserStore.ts - setLoading - isLoading:', isLoading);
            this.loading = isLoading;
        },
        setUser(userData: User): void {
            console.log('useUserStore.ts - setUser - 시작 - userData:', userData);
            this.user = userData;
            this.error = null;
            console.log('useUserStore.ts - setUser - 완료 - user:', this.user);
            localStorage.setItem('user', JSON.stringify(userData));
        },
        clearUser(): void {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            this.error = null;
            this.setLoading(false);
            console.log('useUserStore.ts - clearUser - 로그아웃 완료');
        },
        async login(credentials: any): Promise<{ success: boolean; message?: string }> {
            this.setLoading(true);
            this.error = null;
            try {
                const response = await axios.post('/auth/login', credentials);
                console.log('useUserStore.ts - login - API 응답 성공 - response:', response);
                console.log('useUserStore.ts - login - response.data:', response.data);

                if (response.status === 201 || response.status === 200) {
                    const accessToken = response.data.accessToken;
                    const refreshToken = response.data.refreshToken;
                    const userData = response.data.user;

                    console.log('useUserStore.ts - login - accessToken 추출 직후 - accessToken:', accessToken);
                    console.log('useUserStore.ts - login - refreshToken 추출 직후 - refreshToken:', refreshToken);

                    this.accessToken = accessToken;
                    this.refreshToken = refreshToken;
                    localStorage.setItem('accessToken', accessToken);
                    console.log('useUserStore.ts - login - 엑세스 토큰 저장 직후 - 스토어 accessToken:', this.accessToken);
                    console.log('useUserStore.ts - login - 리프레시 토큰 저장 직후 - 스토어 refreshToken:', this.refreshToken);
                    console.log('useUserStore.ts - login - 엑세스 토큰 저장 직후 - localStorage accessToken:', localStorage.getItem('accessToken'));
                    console.log('useUserStore.ts - login - 리프레시 토큰 localStorage 저장 X');
                    this.setUser(userData);

                    return { success: true };
                } else {
                    const message = response.data?.message || 'Login failed';
                    this.error = new Error(message);
                    return { success: false, message };
                }
            } catch (error: any) {
                console.error('useUserStore.ts - login - API 요청 에러:', error);
                this.accessToken = null;
                this.refreshToken = null;
                localStorage.removeItem('accessToken');
                const message = error.response?.data?.message || 'Login failed';
                this.error = new Error(message);
                return { success: false, message };
            } finally {
                this.setLoading(false);
            }
        },
        async refreshTokenAction(): Promise<boolean> {
            console.log('useUserStore.ts - refreshTokenAction - 시작 - refreshToken:', this.refreshToken);

            if (!this.refreshToken) {
                console.warn('useUserStore.ts - refreshTokenAction - refreshToken 없음');
                return false;
            }

            this.setLoading(true);
            this.error = null;
            try {
                const response = await axios.post('/auth/refresh', { refreshToken: this.refreshToken });
                console.log('useUserStore.ts - refreshTokenAction - API 응답 성공 - response:', response);
                console.log('useUserStore.ts - refreshTokenAction - response.data:', response.data);

                if (response.status === 201 || response.status === 200) {
                    const newAccessToken = response.data.accessToken;
                    const newRefreshToken = response.data.refreshToken;

                    console.log('useUserStore.ts - refreshTokenAction - 새 엑세스 토큰:', newAccessToken);
                    console.log('useUserStore.ts - refreshTokenAction - 새 리프레시 토큰:', newRefreshToken);

                    this.accessToken = newAccessToken;
                    this.refreshToken = newRefreshToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    console.log('useUserStore.ts - refreshTokenAction - 토큰 갱신 완료 및 저장 (localStorage 에 accessToken 만 저장)');
                    return true;
                } else {
                    console.error(
                        'useUserStore.ts - refreshTokenAction - API 응답 실패 (200/201 외) - 상태 코드:',
                        response.status,
                    );
                    this.clearUser();
                    return false;
                }
            } catch (error: any) {
                console.error('useUserStore.ts - refreshTokenAction - API 요청 에러:', error);
                this.clearUser();
                return false;
            } finally {
                this.setLoading(false);
            }
        },
        async checkAuth(): Promise<boolean> {
            console.log('useUserStore.ts - checkAuth - 시작 - accessToken:', this.accessToken);
            this.setLoading(true);

            if (!this.accessToken) {
                console.warn('useUserStore.ts - checkAuth - accessToken 없음');
                this.setLoading(false);
                return false;
            }

            try {
                const response = await axios.get('/auth/profile');
                console.log('useUserStore.ts - checkAuth - API 응답 성공 - response:', response);

                if (response.status === 200 || response.status === 201) {
                    this.setUser(response.data);
                    console.log('useUserStore.ts - checkAuth - 사용자 인증 성공');
                    this.authChecked = true;
                    return true;
                } else if (response.status === 401) {
                    console.warn('useUserStore.ts - checkAuth - 401 에러 - 토큰 갱신 시도');
                    const refreshResult = await this.refreshTokenAction();
                    if (refreshResult) {
                        console.log('useUserStore.ts - checkAuth - 리프레시 토큰 갱신 성공 - 재시도');
                        this.setLoading(false);
                        return this.checkAuth();
                    } else {
                        console.warn('useUserStore.ts - checkAuth - 리프레시 토큰 갱신 실패 - 인증 실패');
                        this.clearUser();
                        this.setLoading(false);
                        return false;
                    }
                } else {
                    console.error(
                        'useUserStore.ts - checkAuth - API 응답 실패 (401 외) - 상태 코드:',
                        response.status,
                    );
                    this.clearUser();
                    this.setLoading(false);
                    return false;
                }
            } catch (error: any) {
                console.error('useUserStore.ts - checkAuth - API 요청 에러:', error);

                if (error.response && error.response.status === 401) {
                    console.warn('useUserStore.ts - checkAuth - 401 에러 (catch) - 토큰 갱신 시도');
                    const refreshResult = await this.refreshTokenAction();
                    if (refreshResult) {
                        console.log('useUserStore.ts - checkAuth - 리프레시 토큰 갱신 성공 - 재시도 (catch 블록)');
                        this.setLoading(false);
                        return this.checkAuth();
                    } else {
                        console.warn('useUserStore.ts - checkAuth - 리프레시 토큰 갱신 실패 - 인증 실패 (catch 블록)');
                        this.clearUser();
                        this.setLoading(false);
                        return false;
                    }
                } else {
                    console.error('useUserStore.ts - checkAuth - API 요청 중 오류 발생 (catch 블록):', error);
                    this.clearUser();
                    this.setLoading(false);
                    return false;
                }
            } finally {
                this.setLoading(false);
                console.log('useUserStore.ts - checkAuth - 종료');
            }
        },
    },
});
