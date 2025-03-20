import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import type { ApiResponse } from '../types/api';
import router from '../router';
import { useUserStore } from '../store/user';

// Augment the InternalAxiosRequestConfig interface to include _retry
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// 환경별 API URL 설정 (production 환경에서 사용될 수 있음)
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_API_URL || '/api'
  : '/api';

// 로깅 추가
console.log('[axios.ts] API_URL 설정:', API_URL);
console.log('[axios.ts] NODE_ENV:', process.env.NODE_ENV);
console.log('[axios.ts] VUE_APP_API_URL:', process.env.VUE_APP_API_URL);

axios.defaults.withCredentials = true;

// 기본 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // 백엔드 API 주소
  timeout: 10000,
  withCredentials: true, // 쿠키 전달을 위해 true 설정
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ baseURL 설정 값 로깅 (생성 시점)
console.log('[axios.ts] apiClient baseURL 설정:', apiClient.defaults.baseURL);

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
      console.log(`[API 요청 인터셉터] ${config.method?.toUpperCase()} ${config.url}`);
      console.log('[API 요청 헤더]', config.headers);
      console.log('[API 요청 데이터]', config.data);
      console.log('[API 요청 baseURL - 인터셉터]', apiClient.defaults.baseURL); // ✅ baseURL 로깅 유지 (인터셉터)
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API 요청 인터셉터 오류]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 개선
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API 응답 인터셉터] ${response.status} ${response.config.url}`); // ✅ 응답 인터셉터 로그
      console.log('[API 응답 데이터]', response.data); // ✅ 응답 데이터 로그
      console.log('[API 응답 헤더]', response.headers); // ✅ 응답 헤더 로그
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig; // 타입 단언 추가
    console.error('[API 응답 인터셉터 오류]', error); // ✅ 응답 인터셉터 오류 로그
    console.error('API 오류 상세:', {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method, // ✅ 요청 메소드 로그 추가
      headers: originalRequest?.headers, // ✅ 요청 헤더 로그 추가
      requestData: originalRequest?.data, // ✅ 요청 데이터 로그 추가
      responseHeaders: error.response?.headers, // ✅ 응답 헤더 로그 추가
      responseData: error.response?.data, // ✅ 응답 데이터 로그 추가
      message: (error.response?.data as { message?: string })?.message || error.message,
    });

    // 401 오류 처리 (인증 오류, 세션 만료)
    if (error.response?.status === 401) {
      console.log('[API 인터셉터] 401 인증 오류 감지: 세션 만료 또는 로그인 필요');
      
      // 현재 페이지 경로 확인
      const currentPath = window.location.pathname;
      const isMainPage = currentPath === '/' || currentPath === '/index.html';
      const isLoginPage = currentPath.includes('/login');
      
      console.log(`[API 인터셉터] 현재 경로: ${currentPath}, 메인페이지: ${isMainPage}, 로그인페이지: ${isLoginPage}`);
      
      // 메인 페이지나 로그인 페이지가 아닌 경우에만 리다이렉트 처리
      if (!isMainPage && !isLoginPage) {
        console.log('[API 인터셉터] 로그인 페이지로 리다이렉트 준비 시작');
        
        // 이미 재시도 중인 요청이 아닌 경우에만 처리
        if (!originalRequest?._retry) {
          originalRequest!._retry = true;
          
          console.log('[API 인터셉터] 인증 상태 정리 시작');
          
          // 인증 상태 완전 초기화 (더 철저한 방식)
          try {
            // 로컬 스토리지에서 인증 정보 제거
            window.localStorage.removeItem('auth-session');
            console.log('[API 인터셉터] 로컬 스토리지 인증 정보 제거 완료');
            
            // 쿠키 정리
            document.cookie.split(';').forEach(cookie => {
              const [name] = cookie.trim().split('=');
              if (name) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              }
            });
            console.log('[API 인터셉터] 쿠키 정리 완료');
            
            // 백엔드 세션도 정리 (선택적)
            try {
              await apiClient.post('/auth/logout', {}, { 
                validateStatus: (status) => true // 오류가 발생해도 계속 진행
              });
              console.log('[API 인터셉터] 백엔드 세션 정리 완료');
            } catch (logoutErr) {
              console.log('[API 인터셉터] 백엔드 세션 정리 실패 (무시됨)');
            }
            
          } catch (clearError) {
            console.error('[API 인터셉터] 인증 상태 초기화 중 오류:', clearError);
          }
          
          console.log('[API 인터셉터] 인증 상태 정리 완료, 로그인 페이지로 리다이렉트 실행');
          
          // 페이지 이동 (지연시간 단축)
          setTimeout(() => {
            window.location.href = '/login?expired=true';
          }, 50);
        } else {
          console.log('[API 인터셉터] 이미 재시도 중인 요청, 추가 처리 없음');
        }
      } else if (isMainPage) {
        console.log('[API 인터셉터] 메인 페이지에서 401 오류 발생, 리다이렉트 없이 오류만 반환');
        // 메인 페이지에서는 리다이렉트 없이 오류만 반환
      } else {
        console.log('[API 인터셉터] 이미 로그인 페이지에 있음, 리다이렉트 건너뜀');
      }
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
