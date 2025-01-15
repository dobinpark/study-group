import { IsString, IsEmail } from 'class-validator';

export class FindPasswordDto {
    @IsString()
    username!: string;

    @IsEmail()
    email!: string;
}
