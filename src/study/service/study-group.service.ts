import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { StudyGroup } from '../entities/study-group.entity';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/entities/user.entity';
import { CategoryDto } from '../dto/category.dto';
import { Connection } from 'typeorm';

@Injectable()
export class StudyGroupService {

    constructor(
        @InjectRepository(StudyGroup)
        private readonly studyGroupRepository: Repository<StudyGroup>,
        private readonly connection: Connection
    ) { }

    // 스터디 그룹 생성
    async create(createStudyGroupDto: CreateStudyGroupDto, userId: number): Promise<StudyGroup> {
        const studyGroup = this.studyGroupRepository.create({
            ...createStudyGroupDto,
            creatorId: userId
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
    async update(id: number, updateStudyGroupDto: UpdateStudyGroupDto, userId: number): Promise<StudyGroup> {
        const studyGroup = await this.findOne(id);

        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹을 수정할 권한이 없습니다.');
        }

        await this.studyGroupRepository.update(id, updateStudyGroupDto);
        return await this.findOne(id);
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

    // 내가 생성한 스터디
    async getMyStudies(userId: number): Promise<{ created: StudyGroup[], joined: StudyGroup[] }> {
        try {
            // 내가 생성한 스터디
            const created = await this.studyGroupRepository.createQueryBuilder('group')
                .leftJoinAndSelect('group.creator', 'creator')
                .leftJoinAndSelect('group.members', 'members')
                .where('group.creatorId = :userId', { userId })
                .orderBy('group.createdAt', 'DESC')
                .getMany();

            // 내가 참여한 스터디 (내가 만든 스터디 제외)
            const joined = await this.studyGroupRepository.createQueryBuilder('group')
                .leftJoinAndSelect('group.creator', 'creator')
                .leftJoinAndSelect('group.members', 'members')
                .innerJoin('group.members', 'member', 'member.id = :userId', { userId })
                .where('group.creatorId != :userId', { userId })
                .orderBy('group.createdAt', 'DESC')
                .getMany();

            return {
                created,
                joined
            };
        } catch (error) {
            throw new InternalServerErrorException('스터디 목록을 조회하는 중 오류가 발생했습니다.');
        }
    }
}
