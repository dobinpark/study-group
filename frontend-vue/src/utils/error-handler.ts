/**
 * API 오류를 나타내는 클래스
 */
export class ApiError extends Error {
    constructor(
        public status: number, // HTTP 상태 코드
        public message: string, // 오류 메시지
        public details?: any // 추가 오류 세부 정보
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * API 오류를 처리하는 함수
 * @param error - Axios 오류 객체
 * @returns ApiError 객체
 */
export const handleApiError = (error: any): ApiError => {
    if (error.response) {
        // 서버 응답이 있는 경우
        return new ApiError(
            error.response.status,
            error.response.data.message || '서버 오류가 발생했습니다.',
            error.response.data
        );
    }
    // 서버 응답이 없는 경우
    return new ApiError(500, '서버와 통신할 수 없습니다.');
};
