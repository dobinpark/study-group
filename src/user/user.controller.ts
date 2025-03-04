import { Controller, Get, Put, Body, Session, UnauthorizedException, UseInterceptors, ClassSerializerInterceptor, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiBody, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserProfileResponseDto } from './dto/user.profileResponse.dto';
import { UpdateUserDto } from './dto/user.userUpdate.dto';
import { CustomSession } from '../types/session.types';
import { DataResponse } from '../types/response.types';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { User } from './entities/user.entity';

@ApiTags('사용자')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class UserController {

    constructor(private readonly userService: UserService) { }

    // 사용자 프로필 조회
    @ApiOperation({ summary: '사용자 프로필 조회' })
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
        const userProfile = await this.userService.findUserProfileById(+id);
        return {
            success: true,
            data: userProfile,
            message: '프로필 정보 조회 성공'
        };
    }

    // 사용자 프로필 수정
    @ApiOperation({ summary: '프로필 수정' })
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
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        const updatedProfile = await this.userService.updateUserProfile(session.user.username, updateUserDto);
        return {
            success: true,
            data: updatedProfile,
            message: '프로필이 성공적으로 수정되었습니다.'
        };
    }
}
