import { IsString, IsEmail, IsPhoneNumber, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: '현재 비밀번호 (비밀번호 변경 시 필수)', required: false })
    @ValidateIf(o => o.newPassword)
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    currentPassword?: string;

    @ApiProperty({ description: '새 비밀번호 (최소 8자)', required: false })
    @IsOptional()
    @IsString({ message: '새 비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
    newPassword?: string;

    @ApiProperty({ description: '닉네임', required: false })
    @IsOptional()
    @IsString({ message: '닉네임은 문자열이어야 합니다.' })
    nickname?: string;

    @ApiProperty({ description: '이메일', required: false })
    @IsOptional()
    @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
    email?: string;

    @ApiProperty({ description: '전화번호 (한국 형식)', required: false })
    @IsOptional()
    @IsPhoneNumber('KR', { message: '올바른 전화번호 형식이 아닙니다.' })
    phoneNumber?: string;
}
