import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
    @ApiProperty({ description: '사용자 ID' })
    id!: number;

    @ApiProperty({ description: '사용자 아이디' })
    username!: string;

    @ApiProperty({ description: '닉네임' })
    nickname!: string;

    @ApiProperty({ description: '이메일' })
    email!: string;

    @ApiProperty({ description: '전화번호' })
    phoneNumber!: string;

    @ApiProperty({ description: '가입일' })
    createdAt!: Date;

    @ApiProperty({ description: '정보 수정일' })
    updatedAt!: Date;

    constructor(user: Partial<UserProfileResponseDto>) {
        Object.assign(this, user);
    }
}
