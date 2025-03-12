import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { StudyGroup } from './entities/study-group.entity';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { User } from '../user/entities/user.entity';
import { CategoryDto } from './dto/category.dto';
import { Connection, DataSource } from 'typeorm';

@Injectable()
export class StudyGroupService {
    private readonly logger = new Logger(StudyGroupService.name);

    constructor(
        @InjectRepository(StudyGroup)
        private readonly studyGroupRepository: Repository<StudyGroup>,
        private readonly connection: Connection,
        private dataSource: DataSource,
    ) { }

    // 스터디 그룹 생성
    async create(createStudyGroupDto: CreateStudyGroupDto, userId: number): Promise<StudyGroup> {
        console.log(`createStudyGroup - service - userId: ${userId}, type: ${typeof userId}`);
        const studyGroup = this.studyGroupRepository.create({
            ...createStudyGroupDto,
            creatorId: userId,
            isOnline: createStudyGroupDto.isOnline !== undefined ? createStudyGroupDto.isOnline : true
        });

        return await this.studyGroupRepository.save(studyGroup) as StudyGroup;
    }


    async findAll(
        mainCategory?: string,
        subCategory?: string,
        detailCategory?: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ items: StudyGroup[]; total: number }> {
        const query = this.studyGroupRepository.createQueryBuilder('studyGroup')
            .leftJoinAndSelect('studyGroup.creator', 'creator')
            .leftJoinAndSelect('studyGroup.members', 'members');

        if (mainCategory) {
            query.andWhere('studyGroup.mainCategory = :mainCategory', { mainCategory });
        }
        if (subCategory) {
            query.andWhere('studyGroup.subCategory = :subCategory', { subCategory });
        }
        if (detailCategory) {
            query.andWhere('studyGroup.detailCategory = :detailCategory', { detailCategory });
        }

        const [items, total] = await query
            .orderBy('studyGroup.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { items, total };
    }

    // 스터디 그룹 상세 조회
    async findOne(id: number): Promise<StudyGroup> {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
            relations: ['creator', 'members']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        return studyGroup;
    }

    // 스터디 그룹 수정
    async update(id: number, updateData: UpdateStudyGroupDto, userId: number): Promise<StudyGroup> {
        this.logger.debug(`update 메서드 호출 - ID: ${id}, userId: ${userId}`);
        try {
            const studyGroup = await this.studyGroupRepository.findOne({ where: { id } });
            if (!studyGroup) {
                this.logger.debug(`스터디 그룹(${id})을 찾을 수 없습니다.`);
                throw new NotFoundException(`스터디 그룹(${id})을 찾을 수 없습니다.`);
            }

            if (studyGroup.creator.id !== userId) {
                this.logger.debug(`사용자(${userId})는 스터디 그룹(${id})의 리더가 아닙니다.`);
                throw new UnauthorizedException('스터디 그룹을 수정할 권한이 없습니다.');
            }

            this.logger.debug(`스터디 그룹 업데이트 시작 - ID: ${id}, updateData: ${JSON.stringify(updateData)}`);
            await this.studyGroupRepository.update(id, updateData);
            const updatedStudyGroup = await this.studyGroupRepository.findOne({ where: { id } });
            this.logger.debug(`스터디 그룹 업데이트 완료 - ID: ${id}`);
            return updatedStudyGroup as StudyGroup;
        } catch (error: unknown) {
            this.logger.error(`스터디 그룹 업데이트 중 오류 발생 - ID: ${id}, userId: ${userId}, Error: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('스터디 그룹 수정 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 삭제
    async remove(id: number, userId: number): Promise<void> {
        const studyGroup = await this.findOne(id);

        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹을 삭제할 권한이 없습니다.');
        }

        await this.studyGroupRepository.delete(id);
    }

    // 스터디 그룹 참여
    async joinGroup(groupId: number, userId: number): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const studyGroup = await this.findOne(groupId);

            if (studyGroup.currentMembers >= studyGroup.maxMembers) {
                throw new BadRequestException('스터디 그룹이 가득 찼습니다.');
            }

            await queryRunner.manager
                .createQueryBuilder()
                .relation(StudyGroup, 'members')
                .of(studyGroup)
                .add(userId);

            await queryRunner.manager.increment(
                StudyGroup,
                { id: groupId },
                'currentMembers',
                1
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // 스터디 그룹 탈퇴
    async leaveGroup(groupId: number, userId: number): Promise<void> {
        const studyGroup = await this.findOne(groupId);

        if (studyGroup.creator.id === userId) {
            throw new BadRequestException('스터디 그룹장은 탈퇴할 수 없습니다.');
        }

        if (!studyGroup.members.some(member => member.id === userId)) {
            throw new BadRequestException('참여하지 않은 스터디 그룹입니다.');
        }

        await this.studyGroupRepository
            .createQueryBuilder()
            .relation(StudyGroup, 'members')
            .of(studyGroup)
            .remove(userId);

        await this.studyGroupRepository.decrement({ id: groupId }, 'currentMembers', 1);
    }

    // 스터디 그룹 카테고리 통계
    async getCategoryStats(): Promise<CategoryDto[]> {
        const stats = await this.studyGroupRepository
            .createQueryBuilder('studyGroup')
            .select([
                'studyGroup.mainCategory',
                'studyGroup.subCategory',
                'studyGroup.detailCategory',
                'COUNT(*) as count'
            ])
            .groupBy('studyGroup.mainCategory')
            .addGroupBy('studyGroup.subCategory')
            .addGroupBy('studyGroup.detailCategory')
            .getRawMany();

        return stats.map(stat => ({
            mainCategory: stat.studyGroup_mainCategory,
            subCategory: stat.studyGroup_subCategory,
            detailCategory: stat.studyGroup_detailCategory,
            count: parseInt(stat.count)
        }));
    }

    // 내가 생성한 스터디 목록 조회
    async getMyStudies(userId: number): Promise<{ created: StudyGroup[], joined: StudyGroup[] }> {
        this.logger.debug(`getMyStudies - service - 메서드 진입`);
        this.logger.debug(`getMyStudies - service - userId 파라미터 타입 (타입 체크 전): ${typeof userId}`);
        if (typeof userId !== 'number' || isNaN(userId)) {
            throw new BadRequestException(`유효하지 않은 사용자 ID입니다. 숫자 타입이 필요합니다. (현재 타입: ${typeof userId})`);
        }
        this.logger.debug(`getMyStudies - service - userId 파라미터 타입 (타입 체크 통과 후): ${typeof userId}`);
        this.logger.debug(`getMyStudies - service - userId 값 (타입 체크 통과 후): ${userId}`);

        try {
            this.logger.debug(`getMyStudies - 사용자 ID: ${userId}의 스터디 목록 조회 시작`);

            // [내가 생성한 스터디] 조회
            this.logger.debug(`getMyStudies - 사용자 ID: ${userId}가 생성한 스터디 조회`);
            const created = await this.studyGroupRepository.find({
                where: { creatorId: userId },
                relations: ['creator', 'members'],
                order: { createdAt: 'DESC' }
            });
            this.logger.debug(`getMyStudies - 생성한 스터디 조회 완료, 개수: ${created.length}`);

            // [내가 참여 중인 스터디] 조회 (내가 생성한 스터디는 제외)
            this.logger.debug(`getMyStudies - 사용자 ID: ${userId}가 참여 중인 스터디 조회 (생성 스터디 제외)`);
            const joined = await this.studyGroupRepository.createQueryBuilder('group')
                .innerJoin('group.members', 'member', 'member.id = :userId', { userId })
                .leftJoinAndSelect('group.creator', 'creator')
                .leftJoinAndSelect('group.members', 'members')
                .where('group.creatorId != :userId', { userId }) // 자신이 생성한 스터디는 제외
                .orderBy('group.createdAt', 'DESC')
                .getMany();
            this.logger.debug(`getMyStudies - 참여 중인 스터디 조회 완료, 개수: ${joined.length}`);

            this.logger.debug(`getMyStudies - 사용자 ID: ${userId}의 스터디 목록 조회 완료`);
            return {
                created,
                joined
            };

        } catch (error) {
            this.logger.error(`getMyStudies - 사용자 ID: ${userId}의 스터디 목록 조회 중 오류 발생`, error);
            throw new InternalServerErrorException('내 스터디 목록을 조회하는 중 오류가 발생했습니다.');
        }
    }
}
