import { Controller, Get, Put, Post, Body, Session, HttpCode, HttpStatus, UnauthorizedException, UseInterceptors, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { CustomSession } from '../../types/session.types';
import { BaseResponse, DataResponse } from '../../types/response.types';
import { TransformInterceptor } from '../../interceptors/response.interceptor';

@ApiTags('사용자')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '회원 가입 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '회원가입이 완료되었습니다.' }
            }
        }
    })
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<BaseResponse> {
        return await this.usersService.signUp(userCredentialsDto);
    }

    @ApiOperation({ summary: '프로필 조회' })
    @Get('/profile')
    async getProfile(@Session() session: CustomSession): Promise<DataResponse<UserProfileResponseDto>> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        const profile = await this.usersService.getUserProfile(session.user.username);
        return {
            success: true,
            data: profile
        };
    }

    @ApiOperation({ summary: '프로필 수정' })
    @Put('/profile')
    async updateProfile(
        @Session() session: CustomSession,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<DataResponse<UserProfileResponseDto>> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        const updatedProfile = await this.usersService.updateUserProfile(session.user.username, updateUserDto);
        return {
            success: true,
            data: updatedProfile,
            message: '프로필이 성공적으로 수정되었습니다.'
        };
    }

    @ApiOperation({ summary: '비밀번호 찾기' })
    @Post('/find-password')
    @HttpCode(HttpStatus.OK)
    async findPassword(@Body() findPasswordDto: FindPasswordDto): Promise<BaseResponse> {
        try {
            await this.usersService.findPassword(findPasswordDto);
            return {
                success: true,
                message: '임시 비밀번호가 이메일로 발송되었습니다.'
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }
            throw error;
        }
    }
}
