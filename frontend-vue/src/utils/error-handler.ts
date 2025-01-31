export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const handleApiError = (error: any): ApiError => {
    if (error.response) {
        return new ApiError(
            error.response.status,
            error.response.data.message || '서버 오류가 발생했습니다.',
            error.response.data
        );
    }
    return new ApiError(500, '서버와 통신할 수 없습니다.');
}; 