import axios from 'axios';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api', // 기본 URL 설정
    withCredentials: true, // 쿠키를 포함한 요청 허용
    timeout: 10000 // 요청 타임아웃 설정
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // 요청 오류 처리
    }
);

// 응답 인터셉터 - 토큰 만료 등 에러 처리
instance.interceptors.response.use(
    (response) => response, // 응답 성공 시 그대로 반환
    (error) => {
        if (error.response?.status === 401) {
            // 인증 오류 시 처리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('nickname');
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error); // 응답 오류 처리
    }
);

export default instance;
