import { defineStore } from 'pinia';
import axios from '../utils/axios';

// 확장된 User 인터페이스 (email, role 추가)
export interface User {
    id: number;
    username: string;
    nickname: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean; // 로딩 상태 추가
    error: string | null; // 오류 메시지 상태 추가
}

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
        loading: false, // 초기 로딩 상태는 false
        error: null,     // 초기 오류 상태는 null
    }),

    actions: {
        setUser(userData: User) {
            console.log('Setting user:', userData);
            this.user = userData;
            this.isAuthenticated = true;
            this.error = null;
        },

        clearUser() {
            console.log('Clearing user');
            this.user = null;
            this.isAuthenticated = false;
            this.error = null;
        },

        async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('/users/login', {
                    username,
                    password
                });

                if (response.status === 201) {
                    const userData = response.data;
                    this.setUser(userData);
                    return { success: true };
                } else {
                    const message = response.data?.message || `Login failed with status code ${response.status}`;
                    throw new Error(message);
                }

            } catch (error: any) {
                console.error('Login failed:', error);
                this.clearUser();
                let errorMessage = '로그인에 실패했습니다.';
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
                this.error = errorMessage;
                return { success: false, message: errorMessage };
            } finally {
                this.loading = false;
            }
        },

        async logout(): Promise<void> {
            this.loading = true;
            try {
                await axios.post('/users/logout');
                this.clearUser();
            } catch (error) {
                console.error('Logout failed but local state cleared:', error);
                this.clearUser();
            } finally {
                this.loading = false;
            }
        },

        loadUserFromStorage() {
            // Ensure the persist plugin is correctly set up
            if (this.user) {
                console.log('User info loaded from storage:', this.user);
                this.isAuthenticated = !!this.user;
            } else {
                console.log('No user info found in storage or persist plugin not ready.');
            }
        },
    },
});
