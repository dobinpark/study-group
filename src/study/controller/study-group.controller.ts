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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
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

    @Post()
    @ApiOperation({ summary: '스터디 그룹 생성' })
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

    @Get()
    @ApiOperation({ summary: '스터디 그룹 목록 조회' })
    @ApiQuery({ name: 'mainCategory', required: false })
    @ApiQuery({ name: 'subCategory', required: false })
    @ApiQuery({ name: 'detailCategory', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
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

    @Get(':id')
    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<DataResponse<StudyGroup>> {
        const studyGroup = await this.studyGroupService.findOne(id);
        return { success: true, data: studyGroup };
    }

    @Put(':id')
    @ApiOperation({ summary: '스터디 그룹 수정' })
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

    @Get('categories/stats')
    @ApiOperation({ summary: '카테고리별 스터디 그룹 통계' })
    async getCategoryStats(): Promise<DataResponse<CategoryDto[]>> {
        const stats = await this.studyGroupService.getCategoryStats();
        return { success: true, data: stats };
    }
}
