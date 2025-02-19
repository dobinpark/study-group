import {
    Controller,
    Post,
    Get,
    Body,
    Session,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { UserProfileResponseDto } from '../user/dto/user-profile.response.dto';
import { DataResponse } from '../types/response.types';
import { CustomSession } from '../types/session.types';
@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class AuthController {

    constructor(private readonly authService: AuthService) { }


    @ApiOperation({ summary: '사용자 로그인' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공' })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Session() session: CustomSession
    ): Promise<{ success: boolean; user: Partial<User>; message: string }> {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        session.user = user;
        return {
            success: true,
            user,
            message: '로그인에 성공했습니다.'
        };
    }


    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Session() session: CustomSession): Promise<{ message: string }> {
        if (session.user) {
            await new Promise<void>((resolve) => {
                session.destroy(() => {
                    resolve();
                });
            });
        }
        return { message: '로그아웃 되었습니다.' };
    }


    @ApiOperation({ summary: '현재 사용자 정보 조회' })
    @ApiResponse({ status: HttpStatus.OK, description: '사용자 정보 조회 성공' })
    @Get('/me')
    async getCurrentUser(
        @Session() session: CustomSession
    ): Promise<{ success: boolean; user: Partial<User> }> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        return {
            success: true,
            user: session.user
        };
    }


    @Get('session')
    @HttpCode(HttpStatus.OK)
    async getSession(@Session() session: CustomSession): Promise<DataResponse<UserProfileResponseDto | null>> {
        if (session.user) {
            return {
                success: true,
                data: session.user ? new UserProfileResponseDto(session.user) : null,
            };
        } else {
            return {
                success: true,
                data: null,
            };
        }
    }
}
