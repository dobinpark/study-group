import { IsString, IsEmail, IsPhoneNumber, MinLength, IsOptional, ValidateIf, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../auth/utils/validation'; // validation.ts import

export class UpdateUserDto {
    @ApiProperty({ description: '현재 비밀번호 (비밀번호 변경 시 필수)', required: false })
    @ValidateIf(o => o.newPassword)
    @IsString({ message: '현재 비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '현재 비밀번호는 최소 8자 이상이어야 합니다.' })
    currentPassword?: string;

    @ApiProperty({ description: '새 비밀번호 (최소 8자, 영문/숫자/특수문자 포함)', required: false })
    @IsOptional()
    @IsString({ message: '새 비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE }) // 비밀번호 정규식 검사 추가
    newPassword?: string;

    @ApiProperty({ description: '닉네임', required: false })
    @IsOptional()
    @IsString({ message: '닉네임은 문자열이어야 합니다.' })
    nickname?: string;

    @ApiProperty({ description: '이메일', required: false })
    @IsOptional()
    @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
    email?: string;

    @ApiProperty({ description: '전화번호 (숫자만)', required: false }) // 전화번호 설명 수정
    @IsOptional()
    @IsString({ message: '전화번호는 문자열이어야 합니다.' }) // IsPhoneNumber 제거, IsString으로 변경
    @Matches(/^[0-9]+$/, { message: '전화번호는 숫자만 입력해주세요.' }) // 숫자만 입력하도록 정규식 검사
    phoneNumber?: string;
}
