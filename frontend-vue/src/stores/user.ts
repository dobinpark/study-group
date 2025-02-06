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
}

export const useUserStore = defineStore('user', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post('/api/users/login', {
                    username,
                    password
                });

                const { userId, nickname } = response.data;
                this.setUser({ id: userId, username, nickname });
                this.isAuthenticated = true;
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },

        logout() {
            this.user = null;
            this.isAuthenticated = false;
        },

        setUser(user: User | null) {
            this.user = user;
            this.isAuthenticated = !!user;
        }
    }
});
