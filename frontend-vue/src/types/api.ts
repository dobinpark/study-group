// API 통신 관련 공통 인터페이스(API 응답 형식, 페이지네이션 파라미터 등)

// API 응답의 공통 형식 정의
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 페이지네이션된 응답을 위한 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 페이지네이션 쿼리 파라미터 타입
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: string;
  createdAt: string;
}
