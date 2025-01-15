import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: '사용자명은 필수입니다.' })
    username!: string;

    @IsString()
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    password!: string;
} 