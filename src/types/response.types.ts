export interface BaseResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface DataResponse<T> extends BaseResponse {
    data: T;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ErrorResponse extends BaseResponse {
    error: string;
    statusCode: number;
} 