import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: null, // 더 이상 사용하지 않지만, null 값으로 유지 (혹시 모를 레거시 코드 호환성 위해)
        refreshToken: null, // 더 이상 사용하지 않지만, null 값으로 유지 (혹시 모를 레거시 코드 호환성 위해)
        user: null,
        loading: false,
        error: null,
        authChecked: false,
        isLoggedIn: false, // 로그인 상태를 Pinia 스토어에서 관리
    }),
    getters: {},
    actions: {
        async fetchSessionStatus() { // 세션 상태 확인 액션 추가
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('/auth/session'); // 세션 상태 확인 API 호출
                if (response.status === 200) {
                    this.isLoggedIn = true; // 세션이 유효하면 로그인 상태를 true로 설정
                    this.user = response.data.data; // 사용자 정보 업데이트 (선택 사항)
                } else {
                    this.isLoggedIn = false; // 세션이 유효하지 않으면 로그인 상태를 false로 설정
                    this.user = null;
                }
                this.authChecked = true;
            } catch (error: any) {
                this.isLoggedIn = false;
                this.user = null;
                this.error = error;
                this.authChecked = true;
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.isLoggedIn = false; // 로그아웃 시 로그인 상태를 false로 변경
            this.user = null;
            localStorage.removeItem('accessToken'); // localStorage 토큰 제거 (더 이상 사용 안함)
            localStorage.removeItem('refreshToken'); // localStorage 토큰 제거 (더 이상 사용 안함)
            delete axios.defaults.headers.common['Authorization'];
        },
        // ... (기존 액션)
    },
}); 