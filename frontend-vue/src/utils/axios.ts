import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'http://3.34.184.97'  // 프로덕션 URL
        : 'http://localhost:3000',  // 개발 URL
    withCredentials: true
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 등 에러 처리
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // 토큰 만료 등의 인증 에러
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('nickname');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
