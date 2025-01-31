import axios from 'axios';

// API URL 설정 개선
const API_URL = {
    development: 'http://localhost:3000',
    production: 'http://3.34.184.97'
};

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? API_URL.production 
        : API_URL.development,
    withCredentials: true,
    timeout: 10000
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
    response => response,
    error => {
        const errorMessage = error.response?.data?.message || '서버 연결에 실패했습니다.';
        console.error('API Error:', errorMessage);
        return Promise.reject(error);
    }
);

export default instance;
