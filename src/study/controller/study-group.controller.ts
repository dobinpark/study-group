import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    Req,
    Query,
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
    UseInterceptors,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { CategoryDto } from '../dto/category.dto';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { StudyGroup } from '../entities/study-group.entity';
import { ErrorResponseDto } from '../../user/dto/error-response.dto';

@ApiTags('스터디')
@Controller('study-groups')
@UseInterceptors(ClassSerializerInterceptor)
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) { }

    @ApiOperation({ summary: '스터디 그룹 목록 조회' })
    @ApiQuery({ name: 'mainCategory', required: false, description: '대분류 (지역별, 학습자별, 전공별)' })
    @ApiQuery({ name: 'subCategory', required: false, description: '중분류 (서울, 고등, 공학계열)' })
    @ApiQuery({ name: 'detailCategory', required: false, description: '소분류 (강남구, 3학년, 컴퓨터공학과)' })
    @ApiQuery({ name: 'search', required: false, description: '검색어' })
    @ApiResponse({
        status: 200,
        description: '스터디 그룹 목록 조회 성공',
        type: [StudyGroup]
    })
    @Get()
    async getStudyGroups(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string,
        @Query('search') search?: string
    ) {
        try {
            const studyGroups = await this.studyGroupService.findAll({
                mainCategory,
                subCategory,
                detailCategory,
                search
            });
            return studyGroups;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '스터디 그룹 생성' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 201,
        description: '스터디 그룹 생성 성공',
        type: StudyGroup
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        type: ErrorResponseDto
    })
    @Post()
    async createStudyGroup(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @Req() req: Request
    ) {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        try {
            const newStudyGroup = await this.studyGroupService.createStudyGroup(createStudyGroupDto, user);
            return newStudyGroup;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '스터디 그룹 상세 조회' })
    @ApiResponse({
        status: 200,
        description: '스터디 그룹 조회 성공',
        type: StudyGroup
    })
    @ApiResponse({
        status: 404,
        description: '스터디 그룹을 찾을 수 없음',
        type: ErrorResponseDto
    })
    @Get(':id')
    async getStudyGroupById(@Param('id') id: number) {
        return await this.studyGroupService.findStudyGroupById(id);
    }

    @ApiOperation({ summary: '스터디 그룹 수정' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '스터디 그룹 수정 성공',
        type: StudyGroup
    })
    @ApiResponse({
        status: 403,
        description: '수정 권한 없음',
        type: ErrorResponseDto
    })
    @Put(':id')
    async updateStudyGroup(
        @Param('id') id: number,
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        @Req() req: Request
    ) {
        const user = req.user as User;
        const studyGroup = await this.studyGroupService.findStudyGroupById(id);

        if (studyGroup.creator.id !== user.id) {
            throw new ForbiddenException('스터디 그룹 수정 권한이 없습니다.');
        }

        return await this.studyGroupService.updateStudyGroup(id, updateStudyGroupDto);
    }

    @ApiOperation({ summary: '스터디 그룹 삭제' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '스터디 그룹 삭제 성공',
        type: StudyGroup
    })
    @ApiResponse({
        status: 403,
        description: '삭제 권한 없음',
        type: ErrorResponseDto
    })
    @Delete(':id')
    async deleteStudyGroup(@Param('id') id: number, @Req() req: Request) {
        const user = req.user as User;
        const studyGroup = await this.studyGroupService.findStudyGroupById(id);

        if (studyGroup.creator.id !== user.id) {
            throw new ForbiddenException('스터디 그룹 삭제 권한이 없습니다.');
        }

        await this.studyGroupService.deleteStudyGroup(id);
        return { message: '스터디 그룹이 성공적으로 삭제되었습니다.' };
    }

    @ApiOperation({ summary: '카테고리별 스터디 그룹 수 조회' })
    @ApiResponse({
        status: 200,
        description: '카테고리별 스터디 그룹 수 조회 성공',
        type: [CategoryDto]
    })
    @Get('categories/count')
    async getStudyGroupCountsByCategory() {
        try {
            const categoryCounts = await this.studyGroupService.getStudyGroupCountsByCategory();
            return categoryCounts;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '스터디 그룹 참여' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '스터디 그룹 참여 성공',
        type: StudyGroup
    })
    @ApiResponse({
        status: 400,
        description: '참여 실패 (인원 초과 등)',
        type: ErrorResponseDto
    })
    @Post(':id/join')
    async joinStudyGroup(@Param('id') id: number, @Req() req: Request) {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        const studyGroup = await this.studyGroupService.findStudyGroupById(id);
        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        try {
            const result = await this.studyGroupService.joinStudyGroup(id, user);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '내 스터디 그룹 목록 조회' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '내 스터디 그룹 목록 조회 성공',
        type: [StudyGroup]
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        type: ErrorResponseDto
    })
    @Get('my-studies')
    async getMyStudyGroups(@Req() req: Request) {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        try {
            const myStudyGroups = await this.studyGroupService.findMyStudyGroups(user);
            return myStudyGroups;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '내가 생성한 스터디 그룹 목록 조회' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '내가 생성한 스터디 그룹 목록 조회 성공',
        type: [StudyGroup]
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        type: ErrorResponseDto
    })
    @Get('my-created-studies')
    async getMyCreatedStudyGroups(@Req() req: Request) {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        try {
            const myCreatedStudyGroups = await this.studyGroupService.findMyCreatedStudyGroups(user);
            return myCreatedStudyGroups;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: '내가 참여한 스터디 그룹 목록 조회' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '내가 참여한 스터디 그룹 목록 조회 성공',
        type: [StudyGroup]
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        type: ErrorResponseDto
    })
    @Get('my-joined-studies')
    async getMyJoinedStudyGroups(@Req() req: Request) {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        try {
            const myJoinedStudyGroups = await this.studyGroupService.findMyJoinedStudyGroups(user);
            return myJoinedStudyGroups;
        } catch (error) {
            throw error;
        }
    }
}
