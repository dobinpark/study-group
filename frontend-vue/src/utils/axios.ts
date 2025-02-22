import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || '/api';

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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
