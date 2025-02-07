import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ description: 'HTTP 상태 코드', example: 400 })
    statusCode!: number;

    @ApiProperty({ description: '에러 메시지', example: '잘못된 요청입니다.' })
    message!: string;

    @ApiProperty({ description: '에러 발생 시간 (ISO String)', example: '2025-03-12T12:30:00.000Z' })
    timestamp!: string; // 또는 Date 타입도 가능

    // 필요에 따라 더 많은 에러 정보 속성 추가 가능 (예: errorCode, detail 등)
}