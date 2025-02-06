import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
    @ApiProperty({ description: 'User ID' })
    id!: number;

    @ApiProperty({ description: 'Username' })
    username!: string;

    @ApiProperty({ description: 'User nickname' })
    nickname!: string;

    @ApiProperty({ description: 'User email' })
    email!: string;

    @ApiProperty({ description: 'User phone number' })
    phoneNumber!: string;

    @ApiProperty({ description: 'User creation date' })
    createdAt!: Date;

    @ApiProperty({ description: 'User last update date' })
    updatedAt!: Date;
}
