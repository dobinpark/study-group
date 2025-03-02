import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthFindPasswordDto {

    @ApiProperty({ 
        example: 'user123', 
        description: '비밀번호를 찾을 사용자 아이디',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: '사용자 아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({ 
        example: 'user@example.com', 
        description: '가입 시 등록한 이메일 주소',
        required: true,
        format: 'email'
    })
    @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
    @IsNotEmpty({ message: '이메일은 필수입니다.' })
    email!: string;
}
