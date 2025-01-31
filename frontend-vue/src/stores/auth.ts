import { defineStore } from 'pinia';
import axios from '../utils/axios';

interface User {
    id: number;
    username: string;
    nickname: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
        token: localStorage.getItem('accessToken')
    }),

    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post('/auth/login', {
                    username,
                    password
                });

                const { accessToken, userId, nickname } = response.data;
                this.setAuth(accessToken, { id: userId, username, nickname });
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },

        setAuth(token: string, user: User) {
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
            localStorage.setItem('accessToken', token);
        },

        logout() {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('accessToken');
        }
    }
});
