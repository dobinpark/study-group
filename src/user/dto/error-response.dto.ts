import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ description: 'HTTP status code' })
    statusCode!: number;

    @ApiProperty({ description: 'Error message' })
    message!: string;

    @ApiProperty({ description: 'Error type', required: false })
    error?: string;

    @ApiProperty({ description: 'Timestamp', example: '2023-10-01T12:00:00.000Z' })
    timestamp!: string;

    @ApiProperty({ description: 'Request path', example: '/users/profile' })
    path!: string;
}
