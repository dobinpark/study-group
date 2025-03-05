import { Controller, Get, Put, Body, Session, UnauthorizedException, UseInterceptors, ClassSerializerInterceptor, Param, NotFoundException, BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiBody, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserProfileResponseDto } from './dto/user.profileResponse.dto';
import { UpdateUserDto } from './dto/user.userUpdate.dto';
import { CustomSession } from '../types/session.types';
import { DataResponse } from '../types/response.types';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/guards/authenticated.guard';

@ApiTags('사용자')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) { }


    // 사용자 프로필 조회 (본인 프로필)
    @Get('profile')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '본인 프로필 조회', description: '현재 로그인된 사용자의 프로필을 조회합니다.' })
    @ApiOkResponse({ description: '프로필 조회 성공', type: UserProfileResponseDto })
    @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
    @ApiBearerAuth()
    async getMyProfile(@Session() session: CustomSession): Promise<DataResponse<UserProfileResponseDto>> {
        this.logger.debug(`getMyProfile 호출: username = ${session.user?.username}`);
        if (!session.user) {
            this.logger.warn(`getMyProfile: 미인증 사용자 접근`);
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        try {
            const userProfile = await this.userService.findUserProfileById(session.user.id);
            this.logger.debug(`getMyProfile 완료: username = ${session.user.username}`);
            return {
                success: true,
                data: userProfile,
                message: '프로필 정보 조회 성공'
            };
        } catch (error) {
            this.logger.error(`getMyProfile: 프로필 조회 실패 - username = ${session.user?.username}`, error);
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`사용자 ID '${session.user.id}'에 해당하는 사용자를 찾을 수 없습니다.`);
            }
            throw error;
        }
    }


    // 사용자 프로필 조회 (ID로 조회 - 관리자용 또는 특정 사용자 프로필 조회용)
    @ApiOperation({ summary: '사용자 프로필 조회 (ID)', description: '사용자 ID로 특정 사용자 프로필을 조회합니다. (관리자 기능)' })
    @ApiParam({
        name: 'id',
        required: true,
        description: '사용자 ID'
    })
    @ApiOkResponse({
        description: '프로필 조회 성공',
        type: UserProfileResponseDto
    })
    @ApiNotFoundResponse({ description: '사용자를 찾을 수 없음' })
    @Get('profile/:id')
    async getUserProfileById(@Param('id') id: string): Promise<DataResponse<UserProfileResponseDto>> {
        this.logger.debug(`getUserProfileById 호출: id = ${id}`);
        const userId = +id;
        if (isNaN(userId) || userId <= 0) {
            this.logger.warn(`getUserProfileById: 잘못된 사용자 ID - id = ${id}`);
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        try {
            const userProfile = await this.userService.findUserProfileById(userId);
            this.logger.debug(`getUserProfileById 완료: id = ${id}, username = ${userProfile.username}`);
            return {
                success: true,
                data: userProfile,
                message: '프로필 정보 조회 성공'
            };
        } catch (error) {
            this.logger.error(`getUserProfileById: 사용자 프로필 조회 실패 - id = ${id}`, error);
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`ID '${id}'에 해당하는 사용자를 찾을 수 없습니다.`);
            }
            throw error;
        }
    }


    // 사용자 프로필 수정 (본인 프로필만 가능)
    @ApiOperation({ summary: '프로필 수정 (본인 프로필만 가능)' })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({
        description: '프로필 수정 성공',
        type: UserProfileResponseDto
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @Put('/profile')
    async updateProfile(
        @Session() session: CustomSession,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<DataResponse<UserProfileResponseDto>> {
        this.logger.debug(`updateProfile 호출: username = ${session.user?.username}`);
        if (!session.user) {
            this.logger.warn(`updateProfile: 미인증 사용자 접근`);
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        if (session.user.id !== session.user.id) {
            this.logger.warn(`updateProfile: 권한 없는 사용자 접근 - username = ${session.user.username}, userId = ${session.user.id}`);
            throw new UnauthorizedException('본인 프로필만 수정할 수 있습니다.');
        }

        try {
            const updatedProfile = await this.userService.updateUserProfile(session.user.username, updateUserDto);
            this.logger.log(`updateProfile 완료: username = ${session.user.username}`);
            return {
                success: true,
                data: updatedProfile,
                message: '프로필이 성공적으로 수정되었습니다.'
            };
        } catch (error) {
            this.logger.error(`updateProfile: 프로필 수정 실패 - username = ${session.user.username}`, error);
            throw error;
        }
    }
}
