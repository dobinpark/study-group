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

    async create(createStudyGroupDto: CreateStudyGroupDto, userId: number): Promise<StudyGroup> {
        const studyGroup = this.studyGroupRepository.create({
            ...createStudyGroupDto,
            creator: { id: userId } as User,
            currentMembers: 1
        });

        return await this.studyGroupRepository.save(studyGroup);
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

    async update(id: number, updateStudyGroupDto: UpdateStudyGroupDto, userId: number): Promise<StudyGroup> {
        const studyGroup = await this.findOne(id);

        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹을 수정할 권한이 없습니다.');
        }

        await this.studyGroupRepository.update(id, updateStudyGroupDto);
        return await this.findOne(id);
    }

    async remove(id: number, userId: number): Promise<void> {
        const studyGroup = await this.findOne(id);

        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹을 삭제할 권한이 없습니다.');
        }

        await this.studyGroupRepository.delete(id);
    }

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
}
