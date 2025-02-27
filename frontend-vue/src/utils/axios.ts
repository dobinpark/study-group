import axios from 'axios';

// API URL은 상대경로로 설정하여 현재 도메인 기준으로 요청
const API_URL = '/api';

console.log('API URL:', API_URL); // 디버깅용

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 401 에러 시 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 절대 경로 대신 상대 경로 사용
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
