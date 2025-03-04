import { IsString, IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../utils/validation';

export class AuthSignupDto {

    @ApiProperty({
        example: 'user123',
        description: '사용자 아이디',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({
        example: 'Password123!',
        description: '비밀번호 (영문, 숫자, 특수문자 포함 8자 이상)',
        required: true,
        minLength: 8,
        pattern: PASSWORD_REGEX.source
    })
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    password!: string;

    @ApiProperty({
        example: 'password123!',
        description: '비밀번호 확인',
        required: true,
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty({ message: '비밀번호 확인은 필수입니다.' })
    confirmPassword!: string;

    @ApiProperty({
        example: '홍길동',
        description: '사용자 닉네임',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수입니다.' })
    nickname!: string;

    @ApiProperty({
        example: 'user@example.com',
        description: '사용자 이메일',
        required: true,
        format: 'email'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '01012345678',
        description: '사용자 휴대전화 (숫자만 11자리)',
        required: true,
        pattern: '^[0-9]{11}$'
    })
    @IsString()
    @IsNotEmpty({ message: '전화번호는 필수입니다.' })
    @Matches(/^[0-9]{11}$/, { message: '올바른 전화번호 형식이 아닙니다. (예: 01012345678)' })
    phoneNumber!: string;
}
