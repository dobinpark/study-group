import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class AuthLoginResponseDto {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    id!: number;

    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    username!: string;

    @ApiProperty({ example: '홍길동', description: '사용자 닉네임' })
    nickname!: string;

    @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
    email!: string;

    @ApiProperty({ example: '01012345678', description: '사용자 전화번호' })
    phoneNumber!: string;

    @ApiProperty({ example: 'USER', description: '사용자 역할', enum: UserRole })
    role!: UserRole;

    @ApiProperty({ example: '2023-10-26T14:30:00.000Z', description: '생성일' })
    createdAt!: Date;

    @ApiProperty({ example: '2023-10-26T14:30:00.000Z', description: '수정일' })
    updatedAt!: Date;
} 