import axios, { type AxiosInstance, isAxiosError } from 'axios';

// Axios 인스턴스 생성
const instance: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api', // 백엔드 서버 URL
    withCredentials: true, // 세션 쿠키 전달 설정
    timeout: 10000,
});

// 요청 인터셉터 (필요시 추가)
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (필요시 추가)
instance.interceptors.response.use(
    (response) => {
        // 응답 성공 시 처리 (예: 데이터 변환)
        return response;
    },
    (error) => {
        // 응답 에러 처리 (예: 401 에러 시 로그인 페이지로 리다이렉트)
        return Promise.reject(error);
    }
);

export { isAxiosError };
export default instance;
