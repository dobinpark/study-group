import { IsString, IsEmail, IsPhoneNumber, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(8)
    currentPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    newPassword?: string;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber('KR')
    phoneNumber?: string;
} 