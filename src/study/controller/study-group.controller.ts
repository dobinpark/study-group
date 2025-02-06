import { Controller, Post, Body, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/entities/user.entity';

@ApiTags('스터디 그룹')
@Controller('study-groups')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) {}

    // 스터디 그룹 생성
    @Post()
    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiResponse({ status: 201, description: '스터디 그룹이 생성되었습니다.' })
    async createStudyGroup(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        user: User
    ) {
        return this.studyGroupService.createStudyGroup(createStudyGroupDto, user);
    }

    // 스터디 그룹 수정
    @Put(':id')
    @ApiOperation({ summary: '스터디 그룹 수정' })
    @ApiResponse({ status: 200, description: '스터디 그룹이 수정되었습니다.' })
    async updateStudyGroup(
        @Param('id') id: number,
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        user: User
    ) {
        return this.studyGroupService.updateStudyGroup(id, updateStudyGroupDto, user);
    }

    // 스터디 그룹 삭제
    @Delete(':id')
    @ApiOperation({ summary: '스터디 그룹 삭제' })
    @ApiResponse({ status: 200, description: '스터디 그룹이 삭제되었습니다.' })
    async deleteStudyGroup(
        @Param('id') id: number,
        user: User
    ) {
        await this.studyGroupService.deleteStudyGroup(id, user);
        return { message: '스터디 그룹이 성공적으로 삭제되었습니다.' };
    }

    // 카테고리별 스터디 그룹 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 스터디 그룹 조회' })
    @ApiQuery({ name: 'mainCategory', required: false })
    @ApiQuery({ name: 'subCategory', required: false })
    @ApiQuery({ name: 'detailCategory', required: false })
    @ApiResponse({ status: 200, description: '스터디 그룹 목록을 반환합니다.' })
    async findByCategory(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string
    ) {
        return this.studyGroupService.findByCategory(mainCategory, subCategory, detailCategory);
    }

    // 내 스터디 목록 조회
    @Get('my-studies')
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiResponse({ status: 200, description: '내가 생성하거나 참여한 스터디 그룹 목록을 반환합니다.' })
    async getMyStudyGroups(user: User) {
        return this.studyGroupService.getMyStudyGroups(user);
    }

    // 스터디 그룹 수 조회
    @Get('count')
    @ApiOperation({ summary: '스터디 그룹 수 조회' })
    @ApiQuery({ name: 'mainCategory', required: false })
    @ApiQuery({ name: 'subCategory', required: false })
    @ApiQuery({ name: 'detailCategory', required: false })
    @ApiResponse({ status: 200, description: '스터디 그룹 수를 반환합니다.' })
    async getStudyGroupCount(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string
    ) {
        const count = await this.studyGroupService.getStudyGroupCount(
            mainCategory,
            subCategory,
            detailCategory
        );
        return { count };
    }

    // 카테고리별 스터디 그룹 수 조회
    @Get('categories')
    @ApiOperation({ summary: '카테고리별 스터디 그룹 수 조회' })
    async getCategories() {
        return await this.studyGroupService.getCategories();
    }

    // 모든 카테고리의 스터디 그룹 수 조회
    @Get('counts/all')
    @ApiOperation({ summary: '모든 카테고리의 스터디 그룹 수 조회' })
    async getAllCounts() {
        const categories = await this.studyGroupService.getCategories();
        const counts: Record<string, Record<string, Record<string, number>>> = {
            '학습별': {},
            '지역별': {}
        };

        // 학습별 카테고리 카운트
        for (const category of categories) {
            if (!counts[category.mainCategory]) {
                counts[category.mainCategory] = {};
            }
            if (!counts[category.mainCategory][category.subCategory]) {
                counts[category.mainCategory][category.subCategory] = {};
            }
            counts[category.mainCategory][category.subCategory][category.detailCategory] = category.count;
        }

        // 지역별 카운트도 포함
        const regionCounts = await this.studyGroupService.getStudyGroupCountsByRegion();
        counts['지역별'] = regionCounts;

        return counts;
    }

    // 지역별 스터디 그룹 수 조회
    @Get('counts/region')
    @ApiOperation({ summary: '지역별 스터디 그룹 수 조회' })
    async getStudyGroupCountsByRegion() {
        return this.studyGroupService.getStudyGroupCountsByRegion();
    }

    // 스터디 그룹 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    @ApiResponse({ status: 200, description: '스터디 그룹 상세 정보를 반환합니다.' })
    async findOne(@Param('id') id: number) {
        return this.studyGroupService.findOne(id);
    }

    // 스터디 그룹 참여
    @Post(':id/join')
    @ApiOperation({ summary: '스터디 그룹 참여' })
    async joinStudyGroup(
        @Param('id') id: number,
        user: User
    ) {
        return this.studyGroupService.joinStudyGroup(id, user);
    }
}
