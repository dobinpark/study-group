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
    InternalServerErrorException,
    Logger,
    Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { BaseResponse, DataResponse } from '../types/response.types';
import { Request } from 'express';
import { AuthSignupDto } from './dto/auth.signUp.dto';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthFindPasswordDto } from './dto/auth.findPassword.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from './guards/authenticated.guard';
import { CustomSession } from '../types/session.types';
import { AuthMeResponseDto } from './dto/meResponse.dto';

@ApiTags('인증')
@ApiCookieAuth()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    // 회원가입
    @ApiOperation({
        summary: '회원가입',
        description: '새로운 사용자 계정을 생성합니다.'
    })
    @ApiBody({
        type: AuthSignupDto,
        description: '사용자 회원가입 정보',
        examples: {
            '기본 예제': {
                value: {
                    username: 'user123',
                    password: 'password123!',
                    confirmPassword: 'password123!',
                    nickname: '홍길동',
                    email: 'user@example.com',
                    phoneNumber: '01012345678'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
        schema: {
            example: {
                success: true,
                message: '회원가입이 완료되었습니다.',
                data: null
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청 (이미 존재하는 사용자, 비밀번호 불일치 등)',
        schema: {
            example: {
                success: false,
                error: '이미 존재하는 아이디입니다.',
                statusCode: 400
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
    @ApiOperation({
        summary: '로그인',
        description: '사용자 로그인을 처리합니다. 로그인 성공 시 세션 기반 인증이 설정됩니다.'
    })
    @ApiBody({
        type: AuthLoginDto,
        description: '로그인 정보',
        examples: {
            '기본 예제': {
                value: {
                    username: 'user123',
                    password: 'password123!'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        schema: {
            example: {
                success: true,
                data: {
                    user: {
                        id: 1,
                        username: 'user123',
                        nickname: '홍길동',
                        email: 'user@example.com',
                        phoneNumber: '01012345678',
                        role: 'USER',
                        createdAt: '2023-10-26T14:30:00.000Z',
                        updatedAt: '2023-10-26T14:30:00.000Z'
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                success: false,
                error: '아이디 또는 비밀번호가 일치하지 않습니다.',
                statusCode: 401
            }
        }
    })
    async login(@Req() req: Request): Promise<any> {
        try {
            if (!req.user) {
                throw new UnauthorizedException('로그인에 실패했습니다.');
            }

            // 로그인 성공 시 디버깅 정보 추가
            this.logger.debug(`세션 ID: ${req.sessionID}`);
            this.logger.debug(`세션 데이터: ${JSON.stringify(req.session)}`);

            return {
                success: true,
                data: {
                    user: req.user
                }
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`로그인 실패: ${errorMessage}`);

            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('로그인 처리 중 오류가 발생했습니다.');
        }
    }

    // 세션 상태 확인
    @Get('session')
    @ApiOperation({
        summary: '세션 확인',
        description: '현재 로그인된 사용자의 세션 정보를 확인합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '세션 정보 조회',
        schema: {
            example: {
                success: true,
                data: {
                    user: {
                        id: 1,
                        username: 'user123',
                        nickname: '홍길동',
                        email: 'user@example.com',
                        role: 'USER'
                    }
                }
            }
        }
    })
    async getSession(@Req() req: Request) {
        try {
            if (req.isAuthenticated && req.isAuthenticated()) {
                const user = await this.authService.findUserById((req.user as User).id);
                if (!user) {
                    return {
                        suceess: false,
                        message: '사용자를 찾을 수 없습니다.'
                    };
                }
                return {
                    success: true,
                    data: {
                        user: user // 최신정보를 넣어줍니다.
                    }
                };
            }

            this.logger.debug('세션 조회 오류 : 인증된 세션이 없습니다.')
            return {
                success: false,
                message: '인증된 세션이 없습니다.'
            };
        } catch (error) {
            this.logger.error(`세션 조회 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            throw new InternalServerErrorException('세션 조회 중 오류가 발생했습니다.');
        }
    }

    // 로그아웃
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '로그아웃',
        description: '현재 로그인된 사용자의 세션을 종료합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '로그아웃 성공',
        schema: {
            example: {
                success: true,
                message: '로그아웃이 완료되었습니다.'
            }
        }
    })
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
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '내 정보 조회', description: '현재 로그인된 사용자의 정보를 조회합니다.' })
    @ApiResponse({
        status: 200, description: '사용자 정보 조회 성공', type: AuthMeResponseDto,
        schema: {
            example: {
                success: true,
                message: '사용자 정보 조회 성공',
                data: { user: { id: 1, username: 'user123', nickname: '홍길동', email: 'user@example.com', role: 'USER' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
    @Get('me')
    async getMe(@Req() req: Request): Promise<DataResponse<AuthMeResponseDto>> {
        const user = req.user as User;
        const userId = user.id;
        this.logger.debug(`내 정보 조회 요청: 사용자 ID ${userId}`);

        const userInfo = await this.authService.findUserById(userId);
        return {
            success: true,
            message: '사용자 정보 조회 성공',
            data: userInfo
        };
    }

    // 비밀번호 찾기
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '비밀번호 찾기',
        description: '사용자 아이디와 이메일을 확인하여 임시 비밀번호를 발급합니다.'
    })
    @ApiBody({
        type: AuthFindPasswordDto,
        description: '비밀번호 찾기 정보',
        examples: {
            '기본 예제': {
                value: {
                    username: 'user123',
                    email: 'user@example.com'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: '임시 비밀번호 발급 성공',
        schema: {
            example: {
                success: true,
                data: {
                    tempPassword: 'a1b2c3D4!'
                },
                message: '임시 비밀번호가 발급되었습니다.'
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없음',
        schema: {
            example: {
                success: false,
                error: '사용자를 찾을 수 없습니다.',
                statusCode: 404
            }
        }
    })
    @Post('find-password')
    async findPassword(@Body() findPasswordDto: AuthFindPasswordDto) {
        const { tempPassword } = await this.authService.findPassword(findPasswordDto);
        return {
            success: true,
            data: { tempPassword },
            message: '임시 비밀번호가 발급되었습니다.'
        };
    }

    /**
     * 사용자가 이미 로그인 상태에서 세션을 갱신
     */
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '세션 갱신',
        description: '현재 로그인된 사용자의 세션을 갱신합니다.'
    })
    @ApiResponse({
        status: 200,
        description: '세션 갱신 성공',
        schema: {
            example: {
                success: true,
                message: '세션이 갱신되었습니다.',
                data: {
                    user: {
                        id: 1,
                        username: 'user123',
                        nickname: '홍길동',
                        email: 'user@example.com',
                        role: 'USER'
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: '인증되지 않은 사용자',
        schema: {
            example: {
                success: false,
                message: '인증 정보가 없습니다.'
            }
        }
    })
    async refreshSession(@Req() req: Request): Promise<any> {
        try {
            // 사용자 인증 여부 확인
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                return {
                    success: false,
                    message: '인증 정보가 없습니다.'
                };
            }
            // 사용자 정보 확인
            const user = req.user;
            // 세션 갱신 (세션 유효기간 연장)
            if (req.session) {
                // 세션 쿠키 만료 시간 연장
                req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24시간
                // 세션 터치 (마지막 사용 시간 갱신)
                req.session.touch();
            }
            this.logger.debug(`세션 갱신 완료: ${req.sessionID}`);
            return {
                success: true,
                message: '세션이 갱신되었습니다.',
                data: {
                    user: user
                }
            };
        } catch (error) {
            this.logger.error(`세션 갱신 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            return {
                success: false,
                message: '세션 갱신 실패'
            };
        }
    }
    @Post('extend-session')
    @UseGuards(AuthGuard)
    async extendSession(@Session() session: CustomSession): Promise<BaseResponse> {
        // 세션 만료 시간 연장 (예: 1시간)
        if (session.cookie) {
            session.cookie.maxAge = 60 * 60 * 1000; // 1시간
        }

        return {
            success: true,
            message: '세션이 연장되었습니다.'
        };
    }
}
