import { defineStore } from 'pinia';

interface User {
    id: number;
    username: string;
    nickname: string;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null
    }),
    actions: {
        setUser(user: User | null) {
            this.user = user;
        }
    }
}); 