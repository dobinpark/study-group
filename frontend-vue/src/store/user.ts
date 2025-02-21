import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { User } from '@/types/user';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
    authChecked: boolean;
    isLoggedIn: boolean;
}

interface AuthActions {
    setLoading(isLoading: boolean): void;
    setUser(user: User): void;
    clearUser(): void;
    login(credentials: { username: string; password: string }): Promise<{ success: boolean; message?: string }>;
    fetchSessionStatus(): Promise<void>;
    logout(): Promise<void>;
}

interface AuthGetters {
    getUser: (state: AuthState) => User | null;
    isLoading: (state: AuthState) => boolean;
    getErrorMessage: (state: AuthState) => string | undefined;
    [key: string]: any;
}

export const useUserStore = defineStore<string, AuthState, AuthGetters, AuthActions>('user', {
    state: (): AuthState => ({
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
                paths: ['user', 'isLoggedIn']
            }
        ]
    },
    getters: {
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        getErrorMessage: (state) => state.error?.message,
    },
    actions: {
        setLoading(isLoading: boolean): void {
            this.loading = isLoading;
        },
        setUser(user: User): void {
            this.user = user;
            this.error = null;
            this.isLoggedIn = true;
        },
        clearUser(): void {
            this.user = null;
            this.isLoggedIn = false;
            this.error = null;
            this.setLoading(false);
        },
        async login(credentials: { username: string; password: string }): Promise<{ success: boolean; message?: string }> {
            this.loading = true;
            try {
                const response = await axios.post('/auth/login', credentials);
                if (response.data.success) {
                    this.user = response.data.user;
                    this.isLoggedIn = true;
                    return { success: true };
                }
                return { success: false, message: response.data.message };
            } catch (error: any) {
                return { success: false, message: error.response?.data?.message || '로그인 실패' };
            } finally {
                this.loading = false;
            }
        },
        async fetchSessionStatus(): Promise<void> {
            this.setLoading(true);
            try {
                const response = await axios.get('/auth/session');
                if (response.status === 200) {
                    this.isLoggedIn = true;
                    this.user = response.data.data;
                } else {
                    this.isLoggedIn = false;
                    this.user = null;
                }
                this.authChecked = true;
            } catch (error) {
                this.isLoggedIn = false;
                this.user = null;
                this.error = error as Error;
                this.authChecked = true;
            } finally {
                this.setLoading(false);
            }
        },
        async logout(): Promise<void> {
            try {
                await axios.post('/auth/logout');
            } finally {
                this.clearUser();
            }
        }
    },
});
