import {
    Controller,
    Post,
    Get,
    Body,
    UnauthorizedException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req,
    Res,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { TransformInterceptor } from '../../interceptors/response.interceptor';
import { BaseResponse, DataResponse } from '../../types/response.types';
import { Request, Response } from 'express';
import { AuthSignupDto } from '../dto/auth.signUp.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthFindPasswordDto } from '../dto/auth.findPassword.dto';
import { AuthLoginResponseDto } from '../dto/auth.loginResponse.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SessionUser } from '../types/sessionUser.type';

@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: '회원가입' })
    @ApiBody({ type: AuthSignupDto })
    @ApiCreatedResponse({
        description: '회원가입 성공',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '회원가입이 완료되었습니다.' }
            }
        }
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        schema: {
            properties: {
                message: { type: 'string', example: '이미 존재하는 아이디입니다.' },
                error: { type: 'string', example: 'Bad Request' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async signUp(@Body() signupDto: AuthSignupDto): Promise<BaseResponse> {
        await this.authService.signUp(signupDto);
        return { success: true, message: '회원가입이 완료되었습니다.' };
    }

    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: AuthLoginDto })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        type: AuthLoginResponseDto
    })
    @ApiUnauthorizedResponse({
        description: '로그인 실패',
        schema: {
            properties: {
                message: { type: 'string', example: '존재하지 않는 사용자입니다.' },
                error: { type: 'string', example: 'Unauthorized' },
                statusCode: { type: 'number', example: 401 }
            }
        }
    })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request): Promise<DataResponse<AuthLoginResponseDto>> {
        if (!req.user) {
            throw new UnauthorizedException('로그인에 실패했습니다.');
        }
        return {
            success: true,
            message: '로그인 성공',
            data: req.user as AuthLoginResponseDto
        };
    }

    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({
        status: 200,
        description: '로그아웃 성공',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '로그아웃 성공' }
            }
        }
    })
    @Post('logout')
    async logout(@Req() req: Request): Promise<BaseResponse> {
        if (req.session) {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }
        return { success: true, message: '로그아웃 되었습니다.' };
    }

    @ApiOperation({ summary: '현재 로그인한 사용자 정보 조회' })
    @ApiResponse({ status: 200, description: '사용자 정보 조회 성공', type: User })
    @Get('me')
    async getMe(@Req() req: Request): Promise<DataResponse<Omit<SessionUser, 'password'>>> {
        const user = req.user as SessionUser;
        return {
            success: true,
            data: user
        };
    }

    @ApiOperation({ summary: '비밀번호 찾기' })
    @ApiResponse({
        status: 200,
        description: '임시 비밀번호 발급 성공',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '임시 비밀번호가 발급되었습니다.' },
                data: {
                    type: 'object',
                    properties: {
                        tempPassword: { type: 'string', example: 'temp123!' }
                    }
                }
            }
        }
    })
    @Post('find-password')
    @HttpCode(HttpStatus.OK)
    async findPassword(@Body() findPasswordDto: AuthFindPasswordDto): Promise<DataResponse<{ tempPassword: string }>> {
        const { tempPassword } = await this.authService.findPassword(findPasswordDto);
        return {
            success: true,
            message: '임시 비밀번호가 발급되었습니다.',
            data: { tempPassword }
        };
    }

    @ApiOperation({ summary: '세션 상태 확인' })
    @ApiResponse({
        status: 200,
        description: '세션 유효성 확인',
        schema: {
            properties: {
                isAuthenticated: { type: 'boolean' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        username: { type: 'string' },
                        nickname: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' }
                    }
                }
            }
        }
    })
    @Get('session')
    async Session(@Req() req: Request): Promise<DataResponse<{ isAuthenticated: boolean; user?: AuthLoginResponseDto }>> {
        const isAuthenticated = req.isAuthenticated?.() || false;
        const user = req.user as AuthLoginResponseDto;
        return {
            success: true,
            data: {
                isAuthenticated,
                user: user || undefined
            }
        };
    }
}
