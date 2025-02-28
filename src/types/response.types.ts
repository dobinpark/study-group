export interface BaseResponse {
    success: boolean;
    message?: string;
    error?: string;
    timestamp?: string;
    path?: string;
}

export interface DataResponse<T> extends BaseResponse {
    data: T | null;
    pagination?: PaginationMeta;
}

export interface ErrorResponse extends BaseResponse {
    error: string;
    statusCode: number;
    stack?: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ListResponse<T> extends DataResponse<T[]> {
    pagination: PaginationMeta;
} 