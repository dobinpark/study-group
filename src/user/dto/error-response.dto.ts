import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ description: 'HTTP 상태 코드' })
    statusCode!: number;

    @ApiProperty({ description: '에러 메시지' })
    message!: string;

    @ApiProperty({ description: '에러 타입', required: false })
    error?: string;

    @ApiProperty({ description: '발생 시간', example: '2023-10-01T12:00:00.000Z' })
    timestamp!: string;

    @ApiProperty({ description: '요청 경로', example: '/users/profile' })
    path!: string;
}
