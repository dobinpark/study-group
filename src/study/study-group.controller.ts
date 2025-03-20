import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    InternalServerErrorException,
    Req,
    Logger,
    UnauthorizedException,
    Patch,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiExtraModels,
    getSchemaPath,
    ApiHeader,
    ApiForbiddenResponse,
    ApiResponse,
} from '@nestjs/swagger';
import { StudyGroupService } from './study-group.service';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { StudyGroup } from './entities/study-group.entity';
import { CategoryDto } from './dto/category.dto';
import { DataResponse, BaseResponse } from '../types/response.types';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetMyStudiesResponseDto } from './dto/get-my-studies-response.dto';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { StudyGroupJoinRequest, JoinRequestStatus } from './entities/study-group-join-request.entity';
import { In } from 'typeorm';

@ApiTags('스터디')
@ApiExtraModels(StudyGroup, CategoryDto, DataResponse<any>, BaseResponse)
@Controller('study-groups')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService, private readonly logger: Logger) { }


    // 스터디 그룹 생성
    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiBody({
        type: CreateStudyGroupDto,
        description: '생성할 스터디 그룹 정보',
        examples: {
            '기본 예시': {
                value: {
                    name: '자바 개발 스터디원 구합니다',
                    mainCategory: '지역별',
                    subCategory: '서울',
                    detailCategory: '강남구',
                    content: '자바 개발 스터디 그룹입니다. 초보자도 환영합니다!',
                    maxMembers: 4,
                    isOnline: true
                }
            }
        }
    })
    @ApiCreatedResponse({
        description: '스터디 그룹 생성 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(StudyGroup) }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @Req() req: Request
    ): Promise<DataResponse<StudyGroup>> {
        try {
            const user = req.user as User;
            this.logger.debug(`createStudyGroup - controller - user.id: ${user.id}, type: ${typeof user.id}`);

            const studyGroup = await this.studyGroupService.create(createStudyGroupDto, user.id);
            return { success: true, data: studyGroup };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 생성 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 생성 중 오류가 발생했습니다.');
        }
    }


    // 스터디 그룹 목록 조회
    @ApiOperation({ summary: '스터디 그룹 목록 조회' })
    @ApiQuery({ name: 'mainCategory', required: false, description: '메인 카테고리' })
    @ApiQuery({ name: 'subCategory', required: false, description: '서브 카테고리' })
    @ApiQuery({ name: 'detailCategory', required: false, description: '상세 카테고리' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: '페이지당 항목 수' })
    @ApiOkResponse({
        description: '스터디 그룹 목록 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                items: {
                                    type: 'array',
                                    items: { $ref: getSchemaPath(StudyGroup) }
                                },
                                total: {
                                    type: 'number',
                                    description: '전체 스터디 그룹 수'
                                }
                            }
                        }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 쿼리 파라미터' })
    @Get()
    async findAll(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<DataResponse<{ items: StudyGroup[]; total: number }>> {
        const result = await this.studyGroupService.findAll(
            mainCategory,
            subCategory,
            detailCategory,
            page,
            limit
        );
        return { success: true, data: result };
    }

    // 내 스터디 목록 조회 - 정적 라우트를 동적 라우트보다 먼저 배치
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiOkResponse({
        description: '내 스터디 목록 조회 성공',
        type: DataResponse<GetMyStudiesResponseDto>,
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(GetMyStudiesResponseDto) }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '로그인이 필요합니다' })
    @ApiInternalServerErrorResponse({ description: '스터디 목록 조회 실패' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Get('my-studies')
    async getMyStudies(@Req() req: Request) {
        // 로깅 추가
        console.log('✅✅✅ getMyStudies 메서드 진입 ✅✅✅');
        console.log('요청 헤더:', req.headers);
        console.log('요청 쿠키:', req.cookies);

        try {
            const user = req.user as User;
            // ID 검증 강화
            if (!user || !user.id) {
                throw new BadRequestException('사용자 정보가 없습니다.');
            }

            return this.studyGroupService.getMyStudies(user.id);
        } catch (error) {
            console.error('getMyStudies 오류:', error);
            throw error;
        }
    }

    // 카테고리별 스터디 그룹 통계 - 정적 라우트를 동적 라우트보다 먼저 배치
    @ApiOperation({ summary: '카테고리별 스터디 그룹 통계' })
    @ApiOkResponse({
        description: '카테고리별 통계 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(CategoryDto) }
                        }
                    }
                }
            ]
        }
    })
    @Get('categories/stats')
    async getCategoryStats(): Promise<DataResponse<CategoryDto[]>> {
        const stats = await this.studyGroupService.getCategoryStats();
        return { success: true, data: stats };
    }

    // 스터디 그룹 상세 조회 - 동적 라우트를 정적 라우트 이후에 배치
    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiOkResponse({
        description: '스터디 그룹 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(StudyGroup) }
                    }
                }
            ]
        }
    })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<DataResponse<StudyGroup>> {
        const studyGroup = await this.studyGroupService.findOne(id);
        return { success: true, data: studyGroup };
    }

    // 스터디 그룹 수정
    @ApiOperation({ summary: '스터디 그룹 수정' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiBody({
        type: UpdateStudyGroupDto,
        description: '수정할 스터디 그룹 정보',
        examples: {
            '기본 예시': {
                value: {
                    name: '스터디 그룹 이름 변경',
                    content: '스터디 내용 업데이트',
                    maxMembers: 5,
                    isOnline: false
                }
            }
        }
    })
    @ApiOkResponse({
        description: '스터디 그룹 수정 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(StudyGroup) }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: UpdateStudyGroupDto,
        @Req() req: Request
    ): Promise<DataResponse<StudyGroup>> {
        this.logger.debug(`update 메서드 호출 - ID: ${id}`);
        this.logger.debug('Request User:', req.user);
        const user = req.user as User;
        if (!user || !user.id) {
            throw new Error('User information is missing in the request.');
        }
        this.logger.debug(`updateStudyGroup - controller - user: ${JSON.stringify(user)}`);
        this.logger.debug(`updateStudyGroup - controller - user.id: ${user.id}, type: ${typeof user.id}`);
        try {
            const updatedGroup = await this.studyGroupService.update(id, updateData, user.id);
            return { success: true, data: updatedGroup };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 수정 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 수정 중 오류가 발생했습니다.');
        }
    }


    // 스터디 그룹 삭제
    @ApiOperation({ summary: '스터디 그룹 삭제' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiOkResponse({
        description: '스터디 그룹 삭제 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        const user = req.user as User;
        try {
            await this.studyGroupService.remove(id, user.id);
            return { success: true, message: '스터디 그룹이 삭제되었습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 삭제 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 삭제 중 오류가 발생했습니다.');
        }
    }


    // 스터디 그룹 참여
    @ApiOperation({ summary: '스터디 그룹 참여' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiOkResponse({
        description: '스터디 그룹 참여 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
    @ApiBadRequestResponse({ description: '참여할 수 없는 스터디 (인원 초과 등)' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Post(':id/join')
    async join(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        const user = req.user as User;
        try {
            await this.studyGroupService.joinGroup(id, user.id);
            return { success: true, message: '스터디 그룹에 참여했습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 참여 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 참여 중 오류가 발생했습니다.');
        }
    }


    // 스터디 그룹 탈퇴
    @ApiOperation({ summary: '스터디 그룹 탈퇴' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiOkResponse({
        description: '스터디 그룹 탈퇴 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
    @ApiBadRequestResponse({ description: '탈퇴할 수 없는 상태' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Delete(':id/leave')
    async leave(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        const user = req.user as User;
        try {
            await this.studyGroupService.leaveGroup(id, user.id);
            return { success: true, message: '스터디 그룹을 탈퇴했습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 탈퇴 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 탈퇴 중 오류가 발생했습니다.');
        }
    }


    // 스터디 그룹 멤버 강제 탈퇴 (방장만 가능)
    @Delete(':id/members/:memberId')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '스터디 그룹 멤버 강제 탈퇴 (방장만 가능)' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiParam({ name: 'memberId', required: true, description: '탈퇴시킬 멤버 ID' })
    @ApiResponse({ status: 200, description: '멤버 강제 탈퇴 성공' })
    @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    @ApiResponse({ status: 404, description: '스터디 그룹을 찾을 수 없음' })
    @ApiResponse({ status: 403, description: '방장만 멤버를 강제 탈퇴시킬 수 있음' })
    async removeMember(
        @Param('id', ParseIntPipe) id: number,
        @Param('memberId', ParseIntPipe) memberId: number,
        @Req() req: Request
    ) {
        this.logger.debug(`removeMember - 호출됨 - 그룹 ID: ${id}, 멤버 ID: ${memberId}`);

        if (!req.user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        const userId = (req.user as User).id;
        this.logger.debug(`요청 사용자 ID: ${userId}`);

        try {
            await this.studyGroupService.removeMember(id, memberId, userId);
            return { success: true, message: '멤버가 성공적으로 강제 탈퇴되었습니다.' };
        } catch (error: any) {
            this.logger.error(`멤버 강제 탈퇴 중 오류 발생: ${error.message}`);

            if (error instanceof NotFoundException) {
                throw error;
            } else if (error instanceof BadRequestException) {
                throw error;
            } else if (error instanceof ForbiddenException) {
                throw error;
            } else {
                throw new BadRequestException('멤버 강제 탈퇴 중 오류가 발생했습니다.');
            }
        }
    }


    // 스터디 그룹 참여 요청
    @ApiOperation({ summary: '스터디 그룹 참여 요청' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiBody({
        type: CreateJoinRequestDto,
        description: '참여 요청 정보'
    })
    @ApiCreatedResponse({
        description: '참여 요청 생성 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) },
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: '참여 요청이 전송되었습니다.' }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Post(':id/join-requests')
    @HttpCode(HttpStatus.CREATED)
    async createJoinRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() createJoinRequestDto: CreateJoinRequestDto,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.studyGroupService.createJoinRequest(id, user.id, createJoinRequestDto);
            return { success: true, message: '참여 요청이 전송되었습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`스터디 그룹 참여 요청 생성 실패: ${errorMessage}`);
            throw new InternalServerErrorException('스터디 그룹 참여 요청 생성 중 오류가 발생했습니다.');
        }
    }


    // 대기 중인 참여 요청 목록 조회
    @ApiOperation({ summary: '대기 중인 참여 요청 목록 조회 (방장용)' })
    @ApiOkResponse({
        description: '대기 중인 참여 요청 목록 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    userId: { type: 'number' },
                                    studyGroupId: { type: 'number' },
                                    status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                                    reason: { type: 'string' },
                                    experience: { type: 'string' },
                                    createdAt: { type: 'string', format: 'date-time' },
                                    updatedAt: { type: 'string', format: 'date-time' },
                                    user: { type: 'object' },
                                    studyGroup: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Get('join-requests/pending')
    async getPendingJoinRequests(@Req() req: Request): Promise<DataResponse<StudyGroupJoinRequest[]>> {
        try {
            const user = req.user as User;
            const requests = await this.studyGroupService.getPendingJoinRequests(user.id);
            return { success: true, data: requests };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`대기 중인 참여 요청 목록 조회 실패: ${errorMessage}`);
            throw new InternalServerErrorException('대기 중인 참여 요청 목록 조회 중 오류가 발생했습니다.');
        }
    }


    // 참여 요청 승인 (PATCH 메서드)
    @ApiOperation({ summary: '참여 요청 승인' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiParam({ name: 'requestId', required: true, description: '참여 요청 ID' })
    @ApiOkResponse({
        description: '참여 요청 승인 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) },
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: '참여 요청이 승인되었습니다.' }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiForbiddenResponse({ description: '권한 없음' })
    @Patch(':id/join-requests/:requestId/approve')
    async approveJoinRequest(
        @Param('id', ParseIntPipe) id: number,
        @Param('requestId', ParseIntPipe) requestId: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.studyGroupService.approveJoinRequest(id, requestId, user.id);
            return { success: true, message: '참여 요청이 승인되었습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`참여 요청 승인 실패: ${errorMessage}`);
            throw new InternalServerErrorException('참여 요청 승인 중 오류가 발생했습니다.');
        }
    }

    // 참여 요청 승인 (POST 메서드)
    @ApiOperation({ summary: '참여 요청 승인 (POST)' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiParam({ name: 'requestId', required: true, description: '참여 요청 ID' })
    @ApiOkResponse({
        description: '참여 요청 승인 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) },
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: '참여 요청이 승인되었습니다.' }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiForbiddenResponse({ description: '권한 없음' })
    @Post(':id/join-requests/:requestId/approve')
    async approveJoinRequestPost(
        @Param('id', ParseIntPipe) id: number,
        @Param('requestId', ParseIntPipe) requestId: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.studyGroupService.approveJoinRequest(id, requestId, user.id);
            return { success: true, message: '참여 요청이 승인되었습니다.' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`참여 요청 승인 실패: ${errorMessage}`);
            throw new InternalServerErrorException('참여 요청 승인 중 오류가 발생했습니다.');
        }
    }

    // 참여 요청 거절 (PATCH 메서드)
    @ApiOperation({ summary: '참여 요청 거절' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiParam({ name: 'requestId', required: true, description: '참여 요청 ID' })
    @ApiOkResponse({
        description: '참여 요청 거절 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) },
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: '참여 요청이 거절되었습니다.' }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiForbiddenResponse({ description: '권한 없음' })
    @Patch(':id/join-requests/:requestId/reject')
    async rejectJoinRequest(
        @Param('id', ParseIntPipe) id: number,
        @Param('requestId', ParseIntPipe) requestId: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.studyGroupService.rejectJoinRequest(id, requestId, user.id);
            return { success: true, message: '참여 요청이 거절되었습니다.' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`참여 요청 거절 실패: ${errorMessage}`);
            throw new InternalServerErrorException('참여 요청 거절 중 오류가 발생했습니다.');
        }
    }

    // 참여 요청 거절 (POST 메서드)
    @ApiOperation({ summary: '참여 요청 거절 (POST)' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiParam({ name: 'requestId', required: true, description: '참여 요청 ID' })
    @ApiOkResponse({
        description: '참여 요청 거절 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) },
                {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: '참여 요청이 거절되었습니다.' }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiForbiddenResponse({ description: '권한 없음' })
    @Post(':id/join-requests/:requestId/reject')
    async rejectJoinRequestPost(
        @Param('id', ParseIntPipe) id: number,
        @Param('requestId', ParseIntPipe) requestId: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.studyGroupService.rejectJoinRequest(id, requestId, user.id);
            return { success: true, message: '참여 요청이 거절되었습니다.' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`참여 요청 거절 실패: ${errorMessage}`);
            throw new InternalServerErrorException('참여 요청 거절 중 오류가 발생했습니다.');
        }
    }

    // 참여 요청 상태 확인
    @ApiOperation({ summary: '참여 요청 상태 확인' })
    @ApiParam({ name: 'id', required: true, description: '스터디 그룹 ID' })
    @ApiOkResponse({
        description: '참여 요청 상태 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    enum: ['pending', 'approved', 'rejected'],
                                    nullable: true,
                                    description: '참여 요청 상태 (null: 요청 없음)'
                                }
                            }
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Get(':id/join-requests/status')
    async checkJoinRequestStatus(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<DataResponse<{ status: JoinRequestStatus | null }>> {
        try {
            const user = req.user as User;
            const status = await this.studyGroupService.checkJoinRequestStatus(id, user.id);
            return { success: true, data: status };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`참여 요청 상태 확인 실패: ${errorMessage}`);
            throw new InternalServerErrorException('참여 요청 상태 확인 중 오류가 발생했습니다.');
        }
    }

    // 내 스터디 그룹의 읽지 않은 공지사항 수 조회
    @ApiOperation({ summary: '참여한 스터디 그룹의 읽지 않은 공지사항 수 조회' })
    @ApiOkResponse({
        description: '읽지 않은 공지사항 수 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'number',
                            description: '읽지 않은 공지사항 수'
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Get('my-studies/notices/unread-count')
    async getUnreadNoticesCount(
        @Req() req: Request
    ): Promise<DataResponse<number>> {
        try {
            const user = req.user as User;
            // 서비스에 해당 메서드가 구현되어 있다고 가정
            const count = await this.studyGroupService.getUnreadNoticesCount(user.id);
            return { success: true, data: count };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`읽지 않은 공지사항 수 조회 실패: ${errorMessage}`);
            throw new InternalServerErrorException('읽지 않은 공지사항 수 조회 중 오류가 발생했습니다.');
        }
    }
}
