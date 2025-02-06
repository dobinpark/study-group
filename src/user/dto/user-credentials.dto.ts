import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Match } from "@/src/common/decorators/match.decorator";
import { ApiProperty } from '@nestjs/swagger';

export class UserCredentialsDto {
    
    @ApiProperty({ example: 'user123', description: '사용자 아이디' })
    @IsString()
    @IsNotEmpty({ message: '아이디는 필수입니다.' })
    username!: string;

    @ApiProperty({ example: 'Password123!', description: '사용자 비밀번호' })
    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    password!: string;

    @IsString()
    @MinLength(8)
    @Match('password')
    confirmPassword!: string;

    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수입니다.' })
    nickname!: string;

    @IsEmail()
    email!: string;

    @IsPhoneNumber('KR')
    phoneNumber!: string;
}
