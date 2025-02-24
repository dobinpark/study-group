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
} from '@nestjs/swagger';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { StudyGroup } from '../entities/study-group.entity';
import { CategoryDto } from '../dto/category.dto';
import { CustomSession } from '../../types/session.types';
import { TransformInterceptor } from '../../interceptors/response.interceptor';
import { DataResponse, BaseResponse } from '../../types/response.types';

@ApiTags('스터디')
@Controller('study-groups')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class StudyGroupController {

    constructor(private readonly studyGroupService: StudyGroupService) {}

    // 스터디 그룹 생성
    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiBody({ type: CreateStudyGroupDto })
    @ApiCreatedResponse({
        description: '스터디 그룹 생성 성공',
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @Session() session: CustomSession
    ): Promise<DataResponse<StudyGroup>> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        const studyGroup = await this.studyGroupService.create(createStudyGroupDto, session.user.id);
        return { success: true, data: studyGroup };
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
        isArray: true
    })
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
    @ApiBody({ type: UpdateStudyGroupDto })
    @ApiOkResponse({
        description: '스터디 그룹 수정 성공',
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiNotFoundResponse({ description: '스터디 그룹을 찾을 수 없음' })
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
    @Delete(':id')
    @ApiOperation({ summary: '스터디 그룹 삭제' })
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
    @Post(':id/join')
    @ApiOperation({ summary: '스터디 그룹 참여' })
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
    @Delete(':id/leave')
    @ApiOperation({ summary: '스터디 그룹 탈퇴' })
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
    @Get('categories/stats')
    @ApiOperation({ summary: '카테고리별 스터디 그룹 통계' })
    async getCategoryStats(): Promise<DataResponse<CategoryDto[]>> {
        const stats = await this.studyGroupService.getCategoryStats();
        return { success: true, data: stats };
    }

    // 내 스터디 목록 조회
    @Get('my-studies')
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiResponse({
        status: 200,
        description: '내가 생성하거나 참여한 스터디 목록',
        type: StudyGroup,
        isArray: true
    })
    @ApiUnauthorizedResponse({ description: '로그인이 필요합니다' })
    async getMyStudies(
        @Session() session: CustomSession
    ): Promise<DataResponse<{ created: StudyGroup[], joined: StudyGroup[] }>> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        try {
            const studies = await this.studyGroupService.getMyStudies(session.user.id);
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
