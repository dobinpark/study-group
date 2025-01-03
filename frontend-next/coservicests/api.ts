import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // NestJS 서버 주소가 맞는지 확인
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터에 콘솔 로그 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터에 콘솔 로그 추가
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export default api;
