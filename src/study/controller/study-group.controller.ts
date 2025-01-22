import { Controller, Post, Body, UseGuards, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { JwtAuthGuard } from '../../user/auth/jwt-auth.guard';
import { GetUser } from '../../user/auth/get-user.decorator';
import { User } from '../../user/users/entities/user.entity';

@ApiTags('스터디 그룹')
@Controller('study-groups')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiResponse({ status: 201, description: '스터디 그룹이 생성되었습니다.' })
    async createStudyGroup(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @GetUser() user: User
    ) {
        return this.studyGroupService.createStudyGroup(createStudyGroupDto, user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 수정' })
    @ApiResponse({ status: 200, description: '스터디 그룹이 수정되었습니다.' })
    async updateStudyGroup(
        @Param('id') id: number,
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        @GetUser() user: User
    ) {
        return this.studyGroupService.updateStudyGroup(id, updateStudyGroupDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '스터디 그룹 삭제' })
    @ApiResponse({ status: 200, description: '스터디 그룹이 삭제되었습니다.' })
    async deleteStudyGroup(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        await this.studyGroupService.deleteStudyGroup(id, user);
        return { message: '스터디 그룹이 성공적으로 삭제되었습니다.' };
    }

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

    @Get('my-studies')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 스터디 목록 조회' })
    @ApiResponse({ status: 200, description: '내가 생성하거나 참여한 스터디 그룹 목록을 반환합니다.' })
    async getMyStudyGroups(@GetUser() user: User) {
        return this.studyGroupService.getMyStudyGroups(user);
    }

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

    @Get('counts/region')
    @ApiOperation({ summary: '지역별 스터디 그룹 수 조회' })
    @ApiResponse({ status: 200, description: '지역별 스터디 그룹 수를 반환합니다.' })
    async getStudyGroupCountsByRegion() {
        return this.studyGroupService.getStudyGroupCountsByRegion();
    }

    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '스터디 그룹 참여' })
    async joinStudyGroup(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        return this.studyGroupService.joinStudyGroup(id, user);
    }

    @Get(':id')
    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    @ApiResponse({ status: 200, description: '스터디 그룹 상세 정보를 반환합니다.' })
    async findOne(@Param('id') id: number) {
        return this.studyGroupService.findOne(id);
    }
}
