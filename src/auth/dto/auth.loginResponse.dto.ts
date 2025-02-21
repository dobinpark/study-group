import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class AuthLoginResponseDto {
    @ApiProperty({ description: '사용자 ID' })
    id!: number;

    @ApiProperty({ description: '사용자 아이디' })
    username!: string;

    @ApiProperty({ description: '사용자 닉네임' })
    nickname!: string;

    @ApiProperty({ description: '사용자 이메일' })
    email!: string;

    @ApiProperty({ description: '사용자 전화번호' })
    phoneNumber!: string;

    @ApiProperty({ description: '사용자 역할', enum: UserRole })
    role!: UserRole;

    @ApiProperty({ description: '생성일' })
    createdAt!: Date;

    @ApiProperty({ description: '수정일' })
    updatedAt!: Date;
} 