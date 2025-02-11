import { Controller, Post, Body, Put, Param, Delete, Get, Query, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/entities/user.entity';
import { StudyGroup } from '../entities/study-group.entity';
import { CategoryDto } from '../dto/category.dto';
import { JwtAuthGuard } from '../../user/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('스터디 그룹')
@Controller('study-groups')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) { }

    // 스터디 그룹 생성
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiCreatedResponse({ description: '스터디 그룹 생성 성공', type: StudyGroup })
    @HttpCode(HttpStatus.CREATED)
    async createStudyGroup(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @Req() req: Request,
    ): Promise<StudyGroup> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.studyGroupService.createStudyGroup(createStudyGroupDto, user);
    }

    // 스터디 그룹 수정
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 수정' })
    @ApiOkResponse({ description: '스터디 그룹 수정 성공', type: StudyGroup })
    async updateStudyGroup(
        @Param('id') id: number,
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        @Req() req: Request,
    ): Promise<StudyGroup> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.studyGroupService.updateStudyGroup(id, updateStudyGroupDto, user);
    }

    // 스터디 그룹 삭제
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 삭제' })
    @ApiOkResponse({ description: '스터디 그룹 삭제 성공', schema: { type: 'object', properties: { message: { type: 'string', example: '스터디 그룹이 성공적으로 삭제되었습니다.' } } } })
    async deleteStudyGroup(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<object> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.studyGroupService.deleteStudyGroup(id, user);
        return { message: '스터디 그룹이 성공적으로 삭제되었습니다.' };
    }

    // 카테고리별 스터디 그룹 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 스터디 그룹 조회' })
    @ApiOkResponse({ description: '스터디 그룹 목록 반환', type: [StudyGroup] })
    @ApiQuery({ name: 'mainCategory', required: false, description: '메인 카테고리' })
    @ApiQuery({ name: 'subCategory', required: false, description: '서브 카테고리' })
    @ApiQuery({ name: 'detailCategory', required: false, description: '세부 카테고리' })
    async findByCategory(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string,
    ): Promise<StudyGroup[]> {
        return this.studyGroupService.findByCategory(mainCategory, subCategory, detailCategory);
    }

    // 내 스터디 목록 조회
    @Get('my-studies')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiOkResponse({ description: '내 스터디 그룹 목록 반환', type: [StudyGroup] })
    async getMyStudyGroups(
        @Req() req: Request,
    ): Promise<{ created: StudyGroup[]; joined: StudyGroup[] }> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.studyGroupService.getMyStudyGroups(user);
    }

    // 스터디 그룹 수 조회
    @Get('count')
    @ApiOperation({ summary: '스터디 그룹 수 조회' })
    @ApiOkResponse({ description: '스터디 그룹 수 반환', schema: { type: 'object', properties: { count: { type: 'number', example: 10 } } } })
    @ApiQuery({ name: 'mainCategory', required: false, description: '메인 카테고리' })
    @ApiQuery({ name: 'subCategory', required: false, description: '서브 카테고리' })
    @ApiQuery({ name: 'detailCategory', required: false, description: '세부 카테고리' })
    async getStudyGroupCount(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string,
    ): Promise<object> {
        const count = await this.studyGroupService.getStudyGroupCount(
            mainCategory,
            subCategory,
            detailCategory,
        );
        return { count };
    }

    // 카테고리별 스터디 그룹 수 조회
    @Get('categories')
    @ApiOperation({ summary: '카테고리별 스터디 그룹 수 조회' })
    @ApiOkResponse({ description: '카테고리별 스터디 그룹 수 반환', type: [CategoryDto] })
    async getCategories(): Promise<CategoryDto[]> {
        return await this.studyGroupService.getCategories();
    }

    // 모든 카테고리의 스터디 그룹 수 조회
    @Get('counts/all')
    @ApiOperation({ summary: '모든 카테고리의 스터디 그룹 수 조회' })
    @ApiOkResponse({
        description: '모든 카테고리별 스터디 그룹 수 반환', schema: {
            type: 'object',
            properties: {
                '지역별': {
                    type: 'object',
                    example: { '서울': 30, '부산': 12, '인천': 8 },
                    description: '지역별 스터디 그룹 수',
                    properties: {
                        '서울': { type: 'number', example: 30 },
                        '부산': { type: 'number', example: 12 },
                        '인천': { type: 'number', example: 8 },
                    },
                },
                '학습자별': {
                    type: 'object',
                    example: {
                        '중등': 25,
                        '고등': 35,
                        '대학/청년': 40,
                    },
                    description: '학습자별 스터디 그룹 수',
                    properties: {
                        '중등': { type: 'number', example: 25 },
                        '고등': { type: 'number', example: 35 },
                        '대학/청년': { type: 'number', example: 40 },
                    },
                },
                '전공별': {
                    type: 'object',
                    example: {
                        '인문계열': 15,
                        '사회과학계열': 20,
                        '자연과학계열': 18,
                    },
                    description: '전공별 스터디 그룹 수',
                    properties: {
                        '인문계열': { type: 'number', example: 15 },
                        '사회과학계열': { type: 'number', example: 20 },
                        '자연과학계열': { type: 'number', example: 18 },
                    },
                },
            },
        }
    })
    async getAllCounts(): Promise<object> {
        const counts: Record<string, Record<string, number>> = {
            '지역별': {
                '서울': 30,
                '부산': 12,
                '인천': 8,
            },
            '학습자별': {
                '중등': 25,
                '고등': 35,
                '대학/청년': 40,
            },
            '전공별': {
                '인문계열': 15,
                '사회과학계열': 20,
                '자연과학계열': 18,
            },
        };
        return counts;
    }

    // 지역별 스터디 그룹 수 조회
    @Get('counts/region')
    @ApiOperation({ summary: '지역별 스터디 그룹 수 조회' })
    @ApiOkResponse({
        description: '지역별 스터디 그룹 수 반환', schema: {
            type: 'object',
            example: { '서울': 30, '부산': 12 },
            additionalProperties: { type: 'number', description: '지역별 스터디 그룹 수' },
        }
    })
    async getStudyGroupCountsByRegion(): Promise<object> {
        return this.studyGroupService.getStudyGroupCountsByRegion();
    }

    // 스터디 그룹 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    @ApiOkResponse({ description: '스터디 그룹 상세 정보 반환', type: StudyGroup })
    async findOne(@Param('id') id: number): Promise<StudyGroup> {
        return this.studyGroupService.findOne(id);
    }

    // 스터디 그룹 참여
    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 참여' })
    @ApiOkResponse({ description: '스터디 그룹 참여 성공', schema: { type: 'object', properties: { message: { type: 'string', example: '스터디 그룹 참여 신청이 완료되었습니다.' } } } })
    async joinStudyGroup(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<object> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.studyGroupService.joinStudyGroup(id, user);
    }
}
