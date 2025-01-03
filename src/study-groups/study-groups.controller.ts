import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { StudyGroupsService } from './study-groups.service';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { User } from '../users/entities/user.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('study-groups')
@UseGuards(JwtAuthGuard)
export class StudyGroupsController {
  constructor(private readonly studyGroupsService: StudyGroupsService) {}

  @Post()
  create(
    @Body() createStudyGroupDto: CreateStudyGroupDto,
    @GetUser() user: User,
  ) {
    return this.studyGroupsService.create(createStudyGroupDto, user);
  }

  @Get()
  findAll() {
    return this.studyGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyGroupsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.studyGroupsService.remove(id, user);
  }

  @Post(':id/join')
  joinGroup(@Param('id') id: string, @GetUser() user: User) {
    return this.studyGroupsService.joinGroup(id, user);
  }

  @Post(':id/leave')
  leaveGroup(@Param('id') id: string, @GetUser() user: User) {
    return this.studyGroupsService.leaveGroup(id, user);
  }

  @Post(':id/schedules')
  createSchedule(
    @Param('id') id: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @GetUser() user: User,
  ) {
    return this.studyGroupsService.createSchedule(id, createScheduleDto, user);
  }

  @Get(':id/schedules')
  getSchedules(@Param('id') id: string, @GetUser() user: User) {
    return this.studyGroupsService.getSchedules(id, user);
  }

  @Get('region/:region')
  async getByRegion(@Param('region') region: string) {
    const groups = await this.studyGroupsService.findByRegion(region);
    return {
      success: true,
      data: groups,
    };
  }

  @Get('category/:category')
  async getByCategory(@Param('category') category: string) {
    const groups = await this.studyGroupsService.findByCategory(category);
    return {
      success: true,
      data: groups,
    };
  }

  @Get('purpose/:purpose')
  async getByPurpose(@Param('purpose') purpose: string) {
    const groups = await this.studyGroupsService.findByPurpose(purpose);
    return {
      success: true,
      data: groups,
    };
  }

  @Get('search')
  async search(@Query('query') query: string) {
    const groups = await this.studyGroupsService.search(query);
    return {
      success: true,
      data: groups,
    };
  }
}
