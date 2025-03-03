import { AxiosError } from 'axios';

/**
 * Axios 오류 타입 체크 유틸리티 함수
 */
export function isAxiosError<T = any>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * API 오류 메시지 추출 유틸리티 함수
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  
  if (isAxiosError(error)) {
    return error.response?.data?.message || 
           error.response?.data?.error || 
           error.message || 
           '서버 통신 중 오류가 발생했습니다.';
  }
  
  return (error as Error).message || '알 수 없는 오류가 발생했습니다.';
} 