import { IsString, IsEmail, IsPhoneNumber, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'Current password (required if changing password)', required: false })
    @ValidateIf(o => o.newPassword) // newPassword가 있을 때만 검증
    @IsString()
    @MinLength(8)
    currentPassword?: string;

    @ApiProperty({ description: 'New password (min length: 8)', required: false })
    @IsOptional()
    @IsString()
    @MinLength(8)
    newPassword?: string;

    @ApiProperty({ description: 'User nickname', required: false })
    @IsOptional()
    @IsString()
    nickname?: string;

    @ApiProperty({ description: 'User email', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'User phone number (KR format)', required: false })
    @IsOptional()
    @IsPhoneNumber('KR')
    phoneNumber?: string;
}
