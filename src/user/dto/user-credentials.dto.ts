import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Match } from "@/src/common/decorators/match.decorator";
import { ApiProperty } from '@nestjs/swagger';

export class UserCredentialsDto {

    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @IsString()
    @IsNotEmpty({ message: '아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({ example: 'password123!', description: '사용자 비밀번호' })
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/, {
        message: '비밀번호는 영문 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    })
    password!: string;

    @ApiProperty({ example: 'password123!', description: '비밀번호 재확인' })
    @IsString()
    @MinLength(8)
    @Match('password')
    confirmPassword!: string;

    @ApiProperty({ example: 'nickName', description: '사용자 닉네임' })
    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수입니다.' })
    nickname!: string;

    @ApiProperty({ example: 'user@email.com', description: '사용자 이메일' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '010-1234-5678', description: '사용자 휴대전화' })
    @IsPhoneNumber('KR')
    phoneNumber!: string;
}
