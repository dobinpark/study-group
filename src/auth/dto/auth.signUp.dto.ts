import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches, IsNotEmpty } from 'class-validator';
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

    @ApiProperty({ example: '010-1234-5678', description: '사용자 휴대전화' })
    @IsPhoneNumber('KR')
    phoneNumber!: string;
}
