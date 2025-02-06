import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindPasswordDto {

    @ApiProperty({ description: 'Username to find password' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ description: 'Registered email address' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}
