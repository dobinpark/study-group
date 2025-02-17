import {
    Controller,
    Post,
    Get,
    UseGuards,
    Req,
    Res,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    Body,
    ForbiddenException,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: '사용자 로그인' })
    @ApiBody({ type: LoginDto, description: '로그인 요청 DTO' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '로그인 성공',
        type: Object,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '잘못된 자격 증명',
    })
    @Post('/login')
    @HttpCode(HttpStatus.CREATED)
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        try {
            const result: LoginResponse =
                await this.authService.login(loginDto);
            return result;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid credentials');
            }
            throw error;
        }
    }

    @ApiOperation({ summary: '엑세스 토큰 갱신 (리프레시 토큰 사용)' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '엑세스 토큰 갱신 성공',
        type: Object,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '유효하지 않은 리프레시 토큰',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '리프레시 토큰 만료/변조',
    })
    @Post('/refresh')
    @HttpCode(HttpStatus.CREATED)
    async refresh(
        @Body('refreshToken') refreshToken: string,
    ): Promise<RefreshResponse> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token required');
        }

        try {
            const result: RefreshResponse =
                await this.authService.refreshAccessToken(refreshToken);
            return result;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid refresh token');
            } else if (error instanceof ForbiddenException) {
                throw new ForbiddenException('RefreshToken 만료 또는 변조됨');
            }
            throw error;
        }
    }

    @ApiOperation({ summary: '사용자 프로필 조회 (JWT 인증 필요)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '프로필 조회 성공',
        type: Object,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - 유효하지 않은 JWT',
    })
    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Req() req: Request): User {
        return req.user as User;
    }
}
