import { IsString, IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../utils/validation';

export class AuthSignupDto {

    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @IsString()
    @IsNotEmpty({ message: '아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({ example: 'password123!', description: '사용자 비밀번호' })
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    password!: string;

    @ApiProperty({ example: 'password123!', description: '비밀번호 재확인' })
    @IsString()
    @MinLength(8)
    confirmPassword!: string;

    @ApiProperty({ example: 'nickName', description: '사용자 닉네임' })
    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수입니다.' })
    nickname!: string;

    @ApiProperty({ example: 'user@email.com', description: '사용자 이메일' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '01012345678', description: '사용자 휴대전화' })
    @IsString()
    @IsNotEmpty({ message: '전화번호는 필수입니다.' })
    @Matches(/^[0-9]{11}$/, { message: '올바른 전화번호 형식이 아닙니다. (예: 01012345678)' })
    phoneNumber!: string;
}
