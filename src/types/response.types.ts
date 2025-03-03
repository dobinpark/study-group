import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class PaginationMeta {
    @ApiProperty({
        description: '전체 항목 수',
        example: 100
    })
    total!: number;

    @ApiProperty({
        description: '현재 페이지',
        example: 1
    })
    page!: number;

    @ApiProperty({
        description: '페이지당 항목 수',
        example: 10
    })
    limit!: number;

    @ApiProperty({
        description: '전체 페이지 수',
        example: 10
    })
    totalPages!: number;

    constructor(partial?: Partial<PaginationMeta>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}

export class BaseResponse {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true
    })
    success: boolean = true;

    @ApiProperty({
        description: '응답 메시지',
        example: '요청이 성공적으로 처리되었습니다.',
        required: false
    })
    message?: string;

    @ApiProperty({
        description: '에러 메시지',
        example: '에러 발생',
        required: false
    })
    error?: string;

    @ApiProperty({
        description: '응답 시간',
        example: '2024-04-01T12:00:00'
    })
    timestamp?: string;

    @ApiProperty({
        description: '요청 경로',
        example: '/api/v1/users'
    })
    path?: string;

    constructor(partial?: Partial<BaseResponse>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}

export class DataResponse<T> extends BaseResponse {
    @ApiProperty({
        description: '응답 데이터',
        required: false,
        nullable: true
    })
    data: T | null = null;

    @ApiProperty({
        description: '페이지네이션 메타 정보',
        type: () => PaginationMeta,
        required: false
    })
    pagination?: PaginationMeta;

    constructor(partial?: Partial<DataResponse<T>>) {
        super(partial);
        if (partial) {
            Object.assign(this, partial);
        }
    }
}

export class ErrorResponse extends BaseResponse {
    @ApiProperty({
        description: '오류 메시지',
        example: '요청 처리 중 오류가 발생했습니다'
    })
    error!: string;

    @ApiProperty({
        description: 'HTTP 상태 코드',
        example: 400
    })
    statusCode!: number;

    @ApiProperty({
        description: '오류 스택 (개발 환경에서만 제공)',
        required: false
    })
    stack?: string;

    constructor(partial?: Partial<ErrorResponse>) {
        super(partial);
        if (partial) {
            Object.assign(this, partial);
        }
    }
}

export class ListResponse<T> extends DataResponse<T[]> {
    @ApiProperty({
        description: '페이지네이션 정보',
        type: () => PaginationMeta
    })
    pagination!: PaginationMeta;

    constructor(partial?: Partial<ListResponse<T>>) {
        super(partial);
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
