import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import type { ApiResponse } from '../types/api';

// 환경별 API URL 설정
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_API_URL || '/api'
  : '/api';

// 기본 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10초 타임아웃 설정
});

// 개발 환경에서만 로그 표시하는 헬퍼 함수
const devLog = (message: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${message}`, data || '');
  }
};

// 오류 로깅 헬퍼 함수
const logError = (error: any): void => {
  console.error('[API 오류]', {
    status: error.response?.status,
    message: error.response?.data?.message || error.message,
    url: error.config?.url
  });
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 개발 환경에서 요청 로깅
    devLog(`${config.method?.toUpperCase()} 요청: ${config.url}`, config.data);
    
    // POST 요청에 캐시 방지 헤더 추가
    if (config.method?.toUpperCase() === 'POST') {
      // 헤더를 개별적으로 설정
      config.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      config.headers.set('Pragma', 'no-cache');
      config.headers.set('Expires', '0');
    }
    
    return config;
  },
  (error: any): Promise<any> => {
    logError(error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 개발 환경에서 응답 로깅
    devLog(`응답 수신 (${response.status}):`, response.data);
    return response;
  },
  (error: any): Promise<any> => {
    logError(error);
    
    // 401 인증 오류 처리
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      const isSessionExpired = message.includes('만료');
      
      // 커스텀 이벤트 발생
      window.dispatchEvent(
        new CustomEvent(isSessionExpired ? 'auth:session-expired' : 'auth:unauthorized', {
          detail: { error, message }
        })
      );
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
