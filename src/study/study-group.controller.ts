import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Session,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    InternalServerErrorException,
    UseGuards,
    Req,
    Logger,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
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
    ApiHeader
} from '@nestjs/swagger';
import { StudyGroupService } from './study-group.service';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { StudyGroup } from './entities/study-group.entity';
import { CategoryDto } from './dto/category.dto';
import { CustomSession } from '../types/session.types';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { DataResponse, BaseResponse } from '../types/response.types';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('스터디')
@ApiExtraModels(StudyGroup, CategoryDto, DataResponse<any>, BaseResponse)
@Controller('study-groups')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class StudyGroupController {
    private readonly logger = new Logger(StudyGroupController.name);

    constructor(private readonly studyGroupService: StudyGroupService) { }


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
    @UseGuards(AuthGuard)
    async create(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @Req() req: Request
    ): Promise<DataResponse<StudyGroup>> {
        try {
            const user = req.user as User;
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


    // 스터디 그룹 상세 조회
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
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        @Session() session: CustomSession
    ): Promise<DataResponse<StudyGroup>> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        const updatedGroup = await this.studyGroupService.update(id, updateStudyGroupDto, session.user.id);
        return { success: true, data: updatedGroup };
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
        @Session() session: CustomSession
    ): Promise<BaseResponse> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        await this.studyGroupService.remove(id, session.user.id);
        return { success: true, message: '스터디 그룹이 삭제되었습니다.' };
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
        @Session() session: CustomSession
    ): Promise<BaseResponse> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        await this.studyGroupService.joinGroup(id, session.user.id);
        return { success: true, message: '스터디 그룹에 참여했습니다.' };
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
        @Session() session: CustomSession
    ): Promise<BaseResponse> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        await this.studyGroupService.leaveGroup(id, session.user.id);
        return { success: true, message: '스터디 그룹을 탈퇴했습니다.' };
    }


    // 카테고리별 스터디 그룹 통계
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


    // 내 스터디 목록 조회
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiOkResponse({
        description: '내 스터디 목록 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                created: {
                                    type: 'array',
                                    items: { $ref: getSchemaPath(StudyGroup) },
                                    description: '내가 생성한 스터디 그룹'
                                },
                                joined: {
                                    type: 'array',
                                    items: { $ref: getSchemaPath(StudyGroup) },
                                    description: '내가 참여한 스터디 그룹'
                                }
                            }
                        }
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
    @UseGuards(AuthGuard)
    @Get('my-studies')
    async getMyStudies(
        @Req() req: Request
    ): Promise<DataResponse<{ created: StudyGroup[], joined: StudyGroup[] }>> {
        if (!req.isAuthenticated()) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        this.logger.debug(`getMyStudies - req.user type: ${typeof req.user}, value: ${JSON.stringify(req.user)}`);
        this.logger.debug(`getMyStudies - session 정보: ${JSON.stringify(req.session)}`);

        console.log("=== StudyGroupController.getMyStudies 메서드 진입 ===");
        console.log(`getMyStudies - controller - req.user type: ${typeof req.user}, value: ${JSON.stringify(req.user)}`);
        const userIdFromReq = (req.user as User)?.id;
        console.log(`getMyStudies - controller - 추출된 userId: ${userIdFromReq}, type: ${typeof userIdFromReq}`);

        try {
            const studies = await this.studyGroupService.getMyStudies((req.user as User).id);
            return {
                success: true,
                message: '스터디 목록을 성공적으로 조회했습니다.',
                data: studies
            };
        } catch (error) {
            throw new InternalServerErrorException('스터디 목록을 조회하는 중 오류가 발생했습니다.');
        }
    }
}
