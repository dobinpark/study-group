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
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@ApiTags('인증')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원 가입 성공' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    @ApiBody({ type: UserCredentialsDto, description: '회원 가입 요청 body' })
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
        await this.usersService.signUp(userCredentialsDto);
    }

    @Post('/login')
    @ApiOperation({ summary: '로그인' })
    @ApiOkResponse({ description: '로그인 성공', type: UserProfileResponseDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    @ApiBody({ type: LoginDto, description: '로그인 요청 body' })
    async login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '사용자 프로필 조회' })
    @ApiOkResponse({
        description: '사용자 프로필 조회 성공',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패',
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @Put('/profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '사용자 프로필 업데이트' })
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
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패',
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    updateProfile(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const username = (req.user as User).username;
        if (!username) {
            throw new UnauthorizedException('User not authenticated');
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
        schema: {
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
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    async findPassword(@Body() findPasswordDto: FindPasswordDto) {
        const { tempPassword } = await this.usersService.findPassword(findPasswordDto);
        return { tempPassword };
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request): Promise<void> {
        // JWT 기반 인증에서는 서버 측에서 로그아웃 로직이 필요 없음
    }

    @Get('/session')
    @ApiOperation({ summary: '세션 상태 확인 (개발용)' })
    @ApiOkResponse({ description: '세션 상태 조회 성공', schema: { type: 'object', example: { isLoggedIn: true, username: 'user1' } } })
    getSession(@Req() req: Request) {
        // JWT 기반 인증에서는 세션 상태 확인이 필요 없음
        return { isLoggedIn: false, username: null };
    }
}
