import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { GetUser } from '../get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { Response } from 'express';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 201,
        description: '회원가입이 완료되었습니다.',
        type: User
    })
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '로그인이 성공했습니다.',
        schema: {
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
            }
        }
    })
    async login(@Body() authCredentialsDto: AuthCredentialsDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authService.logIn(authCredentialsDto);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1시간
        });
        return { message: '로그인 성공' };
    }

    @Post('/refresh')
    @ApiOperation({ summary: '토큰 갱신' })
    @ApiResponse({
        status: 200,
        description: '새로운 액세스 토큰이 발급되었습니다.',
        schema: {
            properties: {
                accessToken: { type: 'string' }
            }
        }
    })
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshAccessToken(refreshToken);
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '프로필 조회' })
    @ApiResponse({
        status: 200,
        description: '사용자 프로필을 반환합니다.',
        type: User
    })
    getProfile(@GetUser() user: User) {
        return user;
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({
        status: 200,
        description: '로그아웃이 완료되었습니다.'
    })
    async logout(@GetUser() user: User) {
        await this.authService.logout(user);
        return { message: '로그아웃이 완료되었습니다.' };
    }
}
