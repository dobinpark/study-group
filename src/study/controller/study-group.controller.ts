import { Controller, Post, Body, UseGuards, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { StudyGroupService } from '../service/study-group.service';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { JwtAuthGuard } from '../../user/auth/jwt-auth.guard';
import { GetUser } from '../../user/auth/get-user.decorator';
import { User } from '../../user/users/entities/user.entity';

@Controller('study-groups')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createStudyGroup(
        @Body() createStudyGroupDto: CreateStudyGroupDto,
        @GetUser() user: User
    ) {
        return this.studyGroupService.createStudyGroup(createStudyGroupDto, user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateStudyGroup(
        @Param('id') id: number,
        @Body() updateStudyGroupDto: UpdateStudyGroupDto,
        @GetUser() user: User
    ) {
        return this.studyGroupService.updateStudyGroup(id, updateStudyGroupDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteStudyGroup(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        await this.studyGroupService.deleteStudyGroup(id, user);
        return { message: '스터디 그룹이 성공적으로 삭제되었습니다.' };
    }

    @Get()
    async findByCategory(
        @Query('mainCategory') mainCategory?: string,
        @Query('subCategory') subCategory?: string,
        @Query('detailCategory') detailCategory?: string
    ) {
        return this.studyGroupService.findByCategory(mainCategory, subCategory, detailCategory);
    }

    @Get('count')
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
}
