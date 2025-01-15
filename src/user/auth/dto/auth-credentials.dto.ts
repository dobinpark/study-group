import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Match } from '@/src/common/decorators/match.decorator';

export class AuthCredentialsDto {
    @IsString()
    @IsNotEmpty({ message: '사용자명은 필수입니다.' })
    username!: string;

    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
        {
            message: '비밀번호는 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
        }
    )
    password!: string;

    @IsString()
    @MinLength(8)
    @Match('password', { message: '비밀번호가 일치하지 않습니다.' })
    confirmPassword!: string;

    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수입니다.' })
    nickname!: string;

    @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
    email!: string;

    @IsPhoneNumber('KR', { message: '유효한 전화번호를 입력해주세요.' })
    phoneNumber!: string;
}
