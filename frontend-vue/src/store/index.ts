import { defineStore } from 'pinia';
import axios from '../utils/axios';
import type { User } from '../types/user';

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    authChecked: boolean;
}

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        user: null,
        loading: false,
        error: null,
        authChecked: false,
    }),

    actions: {
        async login(credentials: any): Promise<{ success: boolean; message?: string }> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('/users/login', credentials);
                if (response.status === 200) {
                    this.setUser(response.data.user);
                    return { success: true };
                } else {
                    const message = response.data?.message || '로그인 실패';
                    this.error = message;
                    return { success: false, message };
                }
            } catch (error: any) {
                console.error('Login failed:', error);
                const message = error.response?.data?.message || '로그인 중 오류 발생';
                this.error = message;
                return { success: false, message };
            } finally {
                this.loading = false;
            }
        },

        logout(): void {
            axios.post('/users/logout')
                .then(() => {
                    this.clearUser();
                    localStorage.removeItem('accessToken');
                })
                .catch((error: any) => {
                    console.error('Logout API call failed:', error);
                    this.error = '로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.';
                });
        },

        async checkAuth(): Promise<boolean> {
            const token = localStorage.getItem('accessToken');
            if (token) {
                this.authChecked = true;
                return true;
            } else {
                this.clearUser();
                return false;
            }
        },

        setUser(userData: User): void {
            this.user = userData;
            this.error = null;
        },

        clearUser(): void {
            this.user = null;
            localStorage.removeItem('user-session-vue');
            this.error = null;
        },

        loadUserFromStorage(): void {
            const storedUser = localStorage.getItem('user-session-vue');
            if (storedUser) {
                try {
                    this.user = JSON.parse(storedUser);
                } catch (e: any) {
                    console.error('Failed to parse user data from storage', e);
                    localStorage.removeItem('user-session-vue');
                    this.clearUser();
                }
            }
            this.authChecked = true;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user-session-vue',
                storage: localStorage,
            },
        ],
    },
});
