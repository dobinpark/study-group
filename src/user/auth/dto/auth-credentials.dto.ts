import { IsString, IsEmail, IsPhoneNumber, MinLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)
    confirmPassword: string;

    @IsString()
    nickname: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber(null)
    phoneNumber: string;
} 