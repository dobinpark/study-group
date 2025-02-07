import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class LoginDto {

    @ApiProperty({example: 'user123', description: '사용자 아이디'})
    @IsString()
    @IsNotEmpty({message: '아이디는 필수입니다.'})
    username!: string;

    @ApiProperty({example: 'password123!', description: '사용자 비밀번호'})
    @IsString()
    @IsNotEmpty({message: '비밀번호는 필수입니다.'})
    @MinLength(8, {message: '비밀번호는 최소 8자 이상이어야 합니다.'})
    @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/, {
        message: '비밀번호는 영문 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    })
    password!: string;
}
