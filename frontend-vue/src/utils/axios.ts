import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import type { ApiResponse } from '../types/api';
import router from '../router';
import { useUserStore } from '../store/user';

// 환경별 API URL 설정 (production 환경에서 사용될 수 있음)
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_API_URL || '/api'
  : '/api';

axios.defaults.withCredentials = true;

// 기본 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // 백엔드 API 주소
  withCredentials: true, // 쿠키 전달을 위해 true 설정
  headers: {
    'Content-Type': 'application/json',
  }
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
  async (config: InternalAxiosRequestConfig) => {
    // 개발 환경에서 요청 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.url}`);
    }
    // 더 이상 요청 인터셉터에서 useAuthStore를 사용하지 않습니다.
    // 필요한 경우, 컴포넌트 또는 서비스에서 직접 헤더에 토큰을 추가하세요.
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터 개선
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 오류 로깅
    console.error('API 오류:', {
      status: error.response?.status,
      url: error.config?.url,
      message: (error.response?.data as { message?: string })?.message || error.message
    });

    // 401 오류 처리 개선 (useAuthStore 제거)
    if (error.response?.status === 401) {
      // 401 에러 발생 시, 필요한 경우 컴포넌트 또는 서비스에서 직접 토큰 갱신 로직을 처리하세요.
      // 더 이상 axios 인터셉터에서 자동 갱신을 시도하지 않습니다.
    }

    return Promise.reject(error);
  }
);

// API 오류 메시지 추출 헬퍼 함수 추가
export const getErrorMessage = (error: any): string => {
  if (!error) return '알 수 없는 오류가 발생했습니다.';

  // 응답이 있는 경우
  if (error.response) {
    // 서버에서 메시지를 보낸 경우
    if (error.response.data?.message) {
      return error.response.data.message;
    }

    // 상태 코드별 기본 메시지
    switch (error.response.status) {
      case 400: return '잘못된 요청입니다.';
      case 401: return '로그인이 필요합니다.';
      case 403: return '접근 권한이 없습니다.';
      case 404: return '요청한 리소스를 찾을 수 없습니다.';
      case 500: return '서버 오류가 발생했습니다.';
      default: return `오류가 발생했습니다. (${error.response.status})`;
    }
  }

  // 네트워크 오류
  if (error.request) {
    return '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
  }

  // 기타 오류
  return error.message || '알 수 없는 오류가 발생했습니다.';
};

export default apiClient;
