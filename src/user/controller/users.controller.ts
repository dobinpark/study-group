import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Req,
    UnauthorizedException,
    UseGuards, InternalServerErrorException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiOkResponse,
    ApiCookieAuth,
} from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';
import { SessionAuthGuard } from '../service/session-auth.guard'; // 가정: 세션 인증 가드

@ApiTags('인증')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원 가입 성공' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    @ApiBody({ type: UserCredentialsDto, description: '회원 가입 요청 body' })
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
        await this.usersService.signUp(userCredentialsDto);
    }

    @Post('/login')
    @ApiOperation({ summary: '로그인' })
    @ApiOkResponse({ description: '로그인 성공', type: UserProfileResponseDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    @ApiBody({ type: LoginDto, description: '로그인 요청 body' })
    async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<UserProfileResponseDto> {
        const user = await this.usersService.login(loginDto);
        if (!user) {
            throw new UnauthorizedException('Login failed');
        }
        req.session.userId = user.id;
        req.session.username = user.username;

        const userProfile = await this.usersService.getUserProfile(user.username);
        return userProfile;
    }

    @Get('/profile')
    @UseGuards(SessionAuthGuard) // 세션 인증 가드 적용
    @ApiCookieAuth('connect.sid') // API 문서에 쿠키 인증 명시
    @ApiOperation({ summary: '사용자 프로필 조회 (세션 인증)' })
    @ApiOkResponse({
        description: '사용자 프로필 조회 성공',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    getProfile(
        @Req() req: Request
    ) {
        const username = req.session['username']; // 세션에서 사용자 이름 가져오기
        if (!username) {
            throw new UnauthorizedException('User not authenticated'); // 세션에 username 없는 경우
        }
        return this.usersService.getUserProfile(username);
    }

    @Put('/profile')
    @UseGuards(SessionAuthGuard) // 세션 인증 가드 적용
    @ApiCookieAuth('connect.sid') // API 문서에 쿠키 인증 명시
    @ApiOperation({ summary: '사용자 프로필 업데이트 (세션 인증)' })
    @ApiBody({
        type: UpdateUserDto,
        description: '프로필 업데이트 body',
        examples: {
            example1: {
                summary: '프로필 업데이트 예시',
                value: {
                    currentPassword: 'oldPassword123',
                    newPassword: 'newPassword456',
                    nickname: 'new_nickname',
                } as UpdateUserDto,
            },
        },
    })
    @ApiOkResponse({
        description: '사용자 프로필 업데이트 성공',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    updateProfile(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const username = req.session['username']; // 세션에서 사용자 이름 가져오기
        if (!username) {
            throw new UnauthorizedException('User not authenticated'); // 세션에 username 없는 경우
        }
        return this.usersService.updateUserProfile(username, updateUserDto);
    }

    @Post('/find-password')
    @ApiOperation({ summary: '비밀번호 찾기' })
    @ApiBody({
        type: FindPasswordDto,
        description: '비밀번호 찾기 body',
        examples: {
            example1: {
                summary: '비밀번호 찾기 예시',
                value: {
                    username: 'john_doe',
                    email: 'john@example.com',
                } as FindPasswordDto,
            },
        },
    })
    @ApiOkResponse({
        description: '임시 비밀번호 발급 성공',
        schema: { // schema 를 사용하여 응답 구조 명시
            type: 'object',
            properties: {
                tempPassword: { type: 'string', example: 'abc123xyz', description: '임시 비밀번호' },
                message: { type: 'string', example: '임시 비밀번호가 발급되었습니다.', description: '성공 메시지' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '사용자 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    async findPassword(@Body() findPasswordDto: FindPasswordDto) {
        const { tempPassword } = await this.usersService.findPassword(findPasswordDto);
        return { tempPassword };
    }

    @Post('/logout')
    @UseGuards(SessionAuthGuard) // 세션 인증 가드 적용
    @ApiCookieAuth('connect.sid') // API 문서에 쿠키 인증 명시
    @ApiOperation({ summary: '로그아웃 (세션 인증)' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패', type: ErrorResponseDto })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류', type: ErrorResponseDto })
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request): Promise<void> {
        req.session.destroy((err) => { // 세션 삭제
            if (err) {
                console.error('세션 삭제 실패', err);
                throw new InternalServerErrorException('Logout failed');
            }
            // 로그아웃 후 리다이렉트 또는 메시지 응답 처리 (선택적)
        });
    }

    @Get('/session')
    @ApiOperation({ summary: '세션 상태 확인 (개발용)' })
    @ApiOkResponse({ description: '세션 상태 조회 성공', schema: { type: 'object', example: { isLoggedIn: true, username: 'user1' } } })
    getSession(@Req() req: Request) {
        // 개발 편의를 위해 세션 상태를 확인할 수 있는 엔드포인트 추가
        const isLoggedIn = !!req.session['userId']; // 세션에 userId가 있으면 로그인 상태로 간주
        const username = req.session['username'] || null;
        return { isLoggedIn, username };
    }
}
