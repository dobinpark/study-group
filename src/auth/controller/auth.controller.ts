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
    Session,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { TransformInterceptor } from '../../interceptors/response.interceptor';
import { BaseResponse, DataResponse } from '../../types/response.types';
import { Request, Response } from 'express';
import { CustomSession } from '../../types/session.types';
import { AuthSignupDto } from '../dto/auth.signUp.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthFindPasswordDto } from '../dto/auth.findPassword.dto';
import { AuthLoginResponseDto } from '../dto/auth.loginResponse.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { SessionData } from 'express-session';

// Passport 세션 인터페이스 확장
interface PassportSession extends Record<string, any> {
  passport?: {
    user: any;
  };
}

@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    // 회원가입
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

    // 로그인
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '로그인 성공' })
    @ApiResponse({ status: 401, description: '로그인 실패' })
    async login(@Req() req: Request): Promise<any> {
        try {
            const user = req.user as User;
            
            // 응답에서 비밀번호 제외
            const { password, ...userInfo } = user;
            
            // 세션에 사용자 정보가 제대로 설정되었는지 확인
            const session = req.session as PassportSession;
            console.log('세션에 저장된 사용자:', session.passport?.user);
            
            return {
                success: true,
                message: '로그인 성공',
                data: {
                    isAuthenticated: true,
                    user: {
                        id: user.id,
                        username: user.username,
                        nickname: user.nickname,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt
                    }
                }
            };
        } catch (error) {
            console.error('로그인 처리 중 오류 발생:', error);
            return {
                success: false,
                message: '로그인에 실패했습니다',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    // 세션 상태 확인
    @Get('session')
    @ApiOperation({ summary: '세션 상태 확인' })
    async checkSession(@Req() req: Request): Promise<any> {
        try {
            if (req.isAuthenticated() && req.user) {
                const { password, ...userInfo } = req.user as any;
                return {
                    success: true,
                    data: {
                        isAuthenticated: true,
                        user: userInfo
                    }
                };
            }
            
            return {
                success: false,
                data: {
                    isAuthenticated: false,
                    user: null
                }
            };
        } catch (error) {
            console.error('세션 확인 중 오류:', error);
            return {
                success: false,
                message: '세션 확인 중 오류가 발생했습니다',
                data: {
                    isAuthenticated: false,
                    user: null
                }
            };
        }
    }

    // 로그아웃
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그아웃' })
    async logout(@Req() req: Request): Promise<any> {
        try {
            const wasLoggedIn = req.isAuthenticated();
            
            // req.logout() 메소드가 콜백을 요구하는 경우를 위한 처리
            await new Promise<void>((resolve, reject) => {
                req.logout((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
            
            req.session.destroy((err) => {
                if (err) {
                    console.error('세션 삭제 중 오류:', err);
                }
            });
            
            return {
                success: true,
                message: wasLoggedIn ? '로그아웃 되었습니다' : '이미 로그아웃 상태입니다'
            };
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            return {
                success: false,
                message: '로그아웃 중 오류가 발생했습니다'
            };
        }
    }

    // 현재 로그인한 사용자 정보 조회
    @ApiOperation({ summary: '현재 로그인한 사용자 정보 조회' })
    @ApiResponse({ status: 200, description: '사용자 정보 조회 성공', type: User })
    @Get('me')
    async getMe(@Req() req: Request): Promise<DataResponse<Omit<User, 'password'>>> {
        const user = req.session?.user;
        if (!user) {
            return {
                success: false,
                message: '인증되지 않은 사용자입니다.',
                data: null as unknown as Omit<User, "password">
            };
        }

        // 세션에 있는 사용자 ID로 최신 사용자 정보 조회
        const userInfo = await this.authService.findUserById(user.id);
        if (!userInfo) {
            return {
                success: false,
                message: '사용자 정보를 찾을 수 없습니다.',
                data: null
            };
        }

        // 사용자 정보 로깅 (디버깅용)
        console.log('GET /auth/me 호출, 사용자 정보:', {
            id: userInfo.id,
            username: userInfo.username,
            role: userInfo.role
        });

        return {
            success: true,
            message: '사용자 정보 조회 성공',
            data: userInfo
        };
    }

    // 비밀번호 찾기
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
}
