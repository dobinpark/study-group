import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../utils/validation';

export class AuthLoginDto {

    @ApiProperty({
        example: 'user123',
        description: '사용자 아이디',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({
        example: 'password123!',
    description: '비밀번호 (최소 8자, 영문/숫자/특수문자 조합)',
        required: true,
        minLength: 8
    })
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    password!: string;
}
