import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class AuthMeResponseDto {

    @ApiProperty({ example: 1, description: '사용자 ID' })
    id!: number;

    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    username!: string;

    @ApiProperty({ example: '홍길동', description: '닉네임' })
    nickname!: string;

    @ApiProperty({ example: 'USER', description: '사용자 역할', enum: UserRole })
    role!: UserRole;
}
