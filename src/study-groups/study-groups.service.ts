import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from './entities/study-group.entity';
import { User } from '../users/entities/user.entity';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { StudyGroupMembership } from './entities/study-group-membership.entity';
import { StudySchedule } from './entities/study-schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class StudyGroupsService {
  constructor(
    @InjectRepository(StudyGroup)
    private studyGroupsRepository: Repository<StudyGroup>,
    @InjectRepository(StudyGroupMembership)
    private membershipRepository: Repository<StudyGroupMembership>,
    @InjectRepository(StudySchedule)
    private scheduleRepository: Repository<StudySchedule>,
    private notificationsService: NotificationsService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /**
   * 새로운 스터디 그룹을 생성합니다.
   */
  @CacheTTL(30)
  async create(
    createStudyGroupDto: CreateStudyGroupDto,
    user: User,
  ): Promise<StudyGroup> {
    const group = this.studyGroupsRepository.create({
      ...createStudyGroupDto,
      owner: user,
      currentMembers: 1, // 방장을 첫 번째 멤버로 포함
    });

    const savedGroup = await this.studyGroupsRepository.save(group);

    // 방장을 멤버로 추가
    const membership = this.membershipRepository.create({
      studyGroup: savedGroup,
      user: user,
      role: 'owner',
    });
    await this.membershipRepository.save(membership);

    return savedGroup;
  }

  /**
   * 모든 스터디 그룹 목록을 조회합니다.
   * 30초 동안 캐시됩니다.
   */
  @CacheTTL(30)
  async findAll(): Promise<StudyGroup[]> {
    return await this.studyGroupsRepository.find();
  }

  /**
   * ID로 특정 스터디 그룹을 조회합니다.
   * 30초 동안 캐시됩니다.
   */
  @CacheTTL(30)
  async findOne(id: string): Promise<StudyGroup> {
    const studyGroup = await this.studyGroupsRepository.findOne({
      where: { id },
    });
    if (!studyGroup) {
      throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
    }
    return studyGroup;
  }

  /**
   * 스터디 그룹을 삭제합니다.
   */
  async remove(id: string, user: User): Promise<void> {
    const studyGroup = await this.findOne(id);

    if (studyGroup.owner.id !== user.id) {
      throw new ForbiddenException('스터디 그룹을 삭제할 권한이 없습니다.');
    }

    await this.studyGroupsRepository.remove(studyGroup);
  }

  /**
   * 스터디 그룹에 참여합니다.
   */
  async joinGroup(groupId: string, user: User): Promise<StudyGroupMembership> {
    const studyGroup = await this.findOne(groupId);

    // 이미 멤버인지 확인
    const existingMembership = await this.membershipRepository.findOne({
      where: { studyGroup: { id: groupId }, user: { id: user.id } },
    });

    if (existingMembership) {
      throw new ConflictException('이미 참여중인 스터디 그룹입니다.');
    }

    // 멤버 수 제한 확인
    if (studyGroup.currentMembers >= studyGroup.maxMembers) {
      throw new BadRequestException('스터디 그룹이 가득 찼습니다.');
    }

    // 멤버십 생성
    const membership = this.membershipRepository.create({
      studyGroup,
      user,
      role: 'member',
    });

    // 현재 멤버 수 증가
    studyGroup.currentMembers += 1;
    await this.studyGroupsRepository.save(studyGroup);

    return await this.membershipRepository.save(membership);
  }

  /**
   * 스터디 그룹에서 탈퇴합니다.
   */
  async leaveGroup(groupId: string, user: User): Promise<void> {
    const membership = await this.membershipRepository.findOne({
      where: { studyGroup: { id: groupId }, user: { id: user.id } },
    });

    if (!membership) {
      throw new NotFoundException('참여하지 않은 스터디 그룹입니다.');
    }

    if (membership.role === 'owner') {
      throw new ForbiddenException('그룹 소유자는 탈퇴할 수 없습니다.');
    }

    // 멤버십 삭제
    await this.membershipRepository.remove(membership);

    // 현재 멤버 수 감소
    const studyGroup = await this.findOne(groupId);
    studyGroup.currentMembers -= 1;
    await this.studyGroupsRepository.save(studyGroup);
  }

  /**
   * 스터디 그룹 일정을 생성합니다.
   */
  async createSchedule(
    groupId: string,
    createScheduleDto: CreateScheduleDto,
    user: User,
  ): Promise<StudySchedule> {
    const studyGroup = await this.findOne(groupId);

    // 멤버십 확인
    const membership = await this.membershipRepository.findOne({
      where: { studyGroup: { id: groupId }, user: { id: user.id } },
    });

    if (!membership) {
      throw new ForbiddenException(
        '스터디 그룹의 멤버만 일정을 생성할 수 있습니다.',
      );
    }

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      studyGroup,
      creator: user,
    });

    // 스케줄 생성 시 알림도 함께 생성
    await this.notificationsService.createNotification({
      type: 'SCHEDULE',
      title: `일정 알림: ${schedule.title}`,
      message: `${schedule.startTime.toLocaleString()}에 시작하는 일정이 있습니다.`,
      user,
      relatedId: schedule.id,
    });

    return await this.scheduleRepository.save(schedule);
  }

  /**
   * 스터디 그룹의 모든 일정을 조회합니다.
   */
  async getSchedules(groupId: string, user: User): Promise<StudySchedule[]> {
    const membership = await this.membershipRepository.findOne({
      where: { studyGroup: { id: groupId }, user: { id: user.id } },
    });

    if (!membership) {
      throw new ForbiddenException(
        '스터디 그룹의 멤버만 일정을 조회할 수 있습니다.',
      );
    }

    return await this.scheduleRepository.find({
      where: { studyGroup: { id: groupId } },
      order: { startTime: 'ASC' },
    });
  }

  async findByRegion(region: string): Promise<StudyGroup[]> {
    return this.studyGroupsRepository.find({
      where: { region },
      relations: ['owner'],
    });
  }

  async findByCategory(category: string): Promise<StudyGroup[]> {
    return this.studyGroupsRepository.find({
      where: { category },
      relations: ['owner'],
    });
  }

  async findByPurpose(purpose: string): Promise<StudyGroup[]> {
    return this.studyGroupsRepository.find({
      where: { purpose },
      relations: ['owner'],
    });
  }

  async search(query: string): Promise<StudyGroup[]> {
    return this.studyGroupsRepository
      .createQueryBuilder('studyGroup')
      .leftJoinAndSelect('studyGroup.owner', 'owner')
      .where(
        'studyGroup.name ILIKE :query OR studyGroup.description ILIKE :query',
        {
          query: `%${query}%`,
        },
      )
      .orderBy('studyGroup.createdAt', 'DESC')
      .getMany();
  }
}
