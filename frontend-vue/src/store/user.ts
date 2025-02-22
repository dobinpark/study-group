import { defineStore } from 'pinia';
import axios from '../utils/axios';
import type { User } from '@/types/user';
import { authService } from '../services/api.service';

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
    login(credentials: { username: string; password: string }): Promise<boolean>;
    fetchSessionStatus(): Promise<void>;
    logout(): Promise<void>;
    checkSessionStatus(): Promise<boolean>;
}

interface AuthGetters {
    getUser: (state: AuthState) => User | null;
    isLoading: (state: AuthState) => boolean;
    getErrorMessage: (state: AuthState) => string | undefined;
    [key: string]: any;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        isLoggedIn: false
    }),

    actions: {
        async login(credentials: { username: string; password: string }) {
            try {
                const response = await axios.post('/auth/login', credentials);
                if (response.data.success) {
                    this.user = response.data.data;
                    this.isLoggedIn = true;
                    return true;
                }
                return false;
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        async logout() {
            await axios.post('/auth/logout');
            this.user = null;
            this.isLoggedIn = false;
        },

        async checkAuth() {
            try {
                const response = await axios.get('/auth/session');
                this.isLoggedIn = response.data.data.isAuthenticated;
                this.user = response.data.data.user;
            } catch {
                this.logout();
            }
        }
    }
});
