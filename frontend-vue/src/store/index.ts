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
    isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: null,
        user: null,
        loading: false,
        error: null,
        authChecked: false,
        isLoggedIn: false,
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage,
                paths: ['user', 'accessToken', 'isLoggedIn']
            }
        ]
    },
    getters: {
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        getErrorMessage: (state) => state.error?.message,
        getAccessToken: (state) => state.accessToken,
        getRefreshToken: (state) => state.refreshToken,
    },
    actions: {
        initialize() {
            const token = localStorage.getItem('accessToken');
            console.log('initialize - stored token:', token);
            if (token && token !== 'undefined' && token !== 'null' && token !== 'null') {
                this.accessToken = token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        this.user = JSON.parse(savedUser);
                        this.isLoggedIn = true;
                    } catch (error) {
                        console.error('Failed to parse saved user:', error);
                        this.clearUser();
                    }
                }
            } else {
                this.clearUser();
            }
        },
        setLoading(isLoading: boolean): void {
            console.log('useUserStore.ts - setLoading - isLoading:', isLoading);
            this.loading = isLoading;
        },
        setUser(user: User): void {
            this.user = user;
            this.error = null;
            localStorage.setItem('user', JSON.stringify(user));
            this.isLoggedIn = true;
            if (this.accessToken && this.accessToken !== 'undefined' && this.accessToken !== 'null') {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
            }
        },
        clearUser(): void {
            delete axios.defaults.headers.common['Authorization'];
            
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.isLoggedIn = false;
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            
            this.error = null;
            this.setLoading(false);
        },
        async login(credentials: any): Promise<{ success: boolean; message?: string }> {
            this.setLoading(true);
            try {
                const response = await axios.post('/auth/login', credentials);
                if (response.status === 201 || response.status === 200) {
                    const { accessToken, refreshToken, user } = response.data;
                    
                    this.accessToken = accessToken;
                    this.refreshToken = refreshToken;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.setUser(user);

                    return { success: true };
                }
                return { success: false, message: 'Login failed' };
            } catch (error: unknown) {
                console.error('Login failed:', error);
                this.clearUser();
                if (error instanceof Error) {
                    return { 
                        success: false, 
                        message: error.message 
                    };
                }
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { data?: { message?: string } } };
                    return {
                        success: false,
                        message: axiosError.response?.data?.message || 'Login failed'
                    };
                }
                return { 
                    success: false, 
                    message: 'Login failed'
                };
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
                    const { accessToken, refreshToken } = response.data;
                    
                    this.accessToken = accessToken;
                    this.refreshToken = refreshToken;
                    localStorage.setItem('accessToken', accessToken);
                    
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    
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
            delete axios.defaults.headers.common['Authorization'];
            this.initialize();
            console.log('checkAuth 시작 - 현재 상태:', {
                accessToken: this.accessToken,
                user: this.user,
                isLoggedIn: this.isLoggedIn
            });

            if (!this.accessToken) {
                console.log('액세스 토큰 없음');
                this.clearUser();
                return false;
            }

            try {
                if (!axios.defaults.headers.common['Authorization']) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
                }

                const response = await axios.get('/auth/profile');
                console.log('프로필 조회 응답:', response.data);

                if (response.status === 200) {
                    this.setUser(response.data);
                    return true;
                }
                return false;
            } catch (error: any) {
                console.error('인증 확인 중 에러:', error.response?.status);
                
                if (error.response?.status === 401) {
                    try {
                        const refreshResult = await this.refreshTokenAction();
                        if (refreshResult) {
                            return this.checkAuth();
                        }
                    } catch (refreshError) {
                        console.error('토큰 갱신 실패:', refreshError);
                    }
                }
                
                this.clearUser();
                return false;
            } finally {
                this.setLoading(false);
            }
        },
    },
});
