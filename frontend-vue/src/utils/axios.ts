import axiosLib from 'axios';
import { useUserStore } from '@/store';

const instance = axiosLib.create({
    baseURL: '/api',
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore();
        const accessToken = userStore.accessToken;

        console.log('axios 인터셉터 - 요청 시작');
        console.log('axios 인터셉터 - accessToken:', accessToken);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('axios 인터셉터 - Authorization 헤더 설정:', config.headers.Authorization);
        } else {
            console.log('axios 인터셉터 - accessToken 없음 - Authorization 헤더 미설정');
        }
        return config;
    },
    (error) => {
        console.error('axios 인터셉터 - 요청 에러:', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        console.log('axios 인터셉터 - 응답 성공:', response);
        return response;
    },
    async (error) => {
        console.error('axios 인터셉터 - 응답 에러:', error);

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn('axios 인터셉터 - 401 에러 감지 - 토큰 갱신 시도');
            originalRequest._retry = true;

            const userStore = useUserStore();

            try {
                const refreshResult = await userStore.refreshTokenAction();
                if (refreshResult) {
                    console.log('axios 인터셉터 - 토큰 갱신 성공 - API 요청 재시도');
                    return instance(originalRequest); // instance 사용
                } else {
                    console.warn('axios 인터셉터 - 토큰 갱신 실패 - 로그아웃 처리');
                    userStore.clearUser();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('axios 인터셉터 - 토큰 갱신 에러 (catch):', refreshError);
                userStore.clearUser();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
