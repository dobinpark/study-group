import {
    Controller,
    Get,
    Put,
    Post,
    Body
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiOkResponse
} from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { User } from '../entities/user.entity';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'Successfully registered' })
    async signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
        await this.usersService.signUp(userCredentialsDto);
    }

    @Post('/login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Successfully logged in' })
    async login(@Body() userCredentialsDto: UserCredentialsDto): Promise<User> {
        return await this.usersService.login(userCredentialsDto);
    }

    @Get('/profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiOkResponse({
        description: 'Successfully retrieved user profile',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    getProfile(@Body('username') username: string) {
        return this.usersService.getUserProfile(username);
    }

    @Put('/profile')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiBody({
        type: UpdateUserDto,
        examples: {
            example1: {
                value: {
                    currentPassword: 'oldPassword123',
                    newPassword: 'newPassword456',
                    nickname: 'new_nickname',
                },
            },
        },
    })
    @ApiOkResponse({
        description: 'Successfully updated user profile',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: ErrorResponseDto,
    })
    updateProfile(
        @Body('username') username: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.updateUserProfile(username, updateUserDto);
    }

    @Post('find-password')
    @ApiOperation({ summary: 'Find user password' })
    @ApiBody({
        type: FindPasswordDto,
        examples: {
            example1: {
                value: {
                    username: 'john_doe',
                    email: 'john@example.com',
                },
            },
        },
    })
    @ApiOkResponse({
        description: 'Temporary password generated',
        schema: {
            type: 'object',
            properties: {
                tempPassword: { type: 'string', example: 'abc123xyz' },
                message: { type: 'string', example: '임시 비밀번호가 발급되었습니다.' },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async findPassword(@Body() findPasswordDto: FindPasswordDto) {
        const { tempPassword } = await this.usersService.findPassword(findPasswordDto);
        return { tempPassword };
    }

    @Post('/logout')
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    async logout(): Promise<void> {
        await this.usersService.logout();
    }
}
