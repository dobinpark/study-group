import { Controller, Get, Put, Post, Body, HttpCode, HttpStatus, Req, UnauthorizedException, UseGuards, UseInterceptors, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { ErrorResponseDto } from '../../user/dto/error-response.dto';
@ApiTags('사용자')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원 가입 성공' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    @ApiBody({ type: UserCredentialsDto, description: '회원 가입 요청 body' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    async signUp(@Body() userCredentialsDto: UserCredentialsDto) {
        return await this.usersService.signUp(userCredentialsDto);
    }

    @ApiOperation({ summary: '사용자 프로필 조회' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: '사용자 프로필 조회 성공',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패',
    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: '서버 오류' })
    @Get('/profile')
    async getProfile(@Req() req: Request): Promise<UserProfileResponseDto> {
        const username = (req.user as User).username;
        if (!username) {
            throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
        }
        return this.usersService.getUserProfile(username);
    }

    @ApiOperation({ summary: '사용자 프로필 업데이트' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
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
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '서버 오류',
        type: ErrorResponseDto,
    })
    @Put('/profile')
    @Put('/profile')
    async updateProfile(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserProfileResponseDto | null> {
        const username = (req.user as User).username;
        if (!username) {
            throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
        }
        return this.usersService.updateUserProfile(username, updateUserDto);
    }

    @ApiOperation({ summary: '비밀번호 찾기' })
    @ApiResponse({
        status: HttpStatus.OK,
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
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '서버 오류',
        type: ErrorResponseDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post('/find-password')
    async findPassword(@Body() findPasswordDto: FindPasswordDto): Promise<{ message: string }> {
        try {
            await this.usersService.findPassword(findPasswordDto);
            return { message: '임시 비밀번호가 이메일로 발송되었습니다.' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }
            throw error;
        }
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
    }
}
