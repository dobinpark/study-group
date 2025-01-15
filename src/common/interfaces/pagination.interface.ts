export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}
