import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from '../entities/study-group.entity';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/users/entities/user.entity';

@Injectable()
export class StudyGroupService {
    constructor(
        @InjectRepository(StudyGroup)
        private studyGroupRepository: Repository<StudyGroup>,
    ) {}

    async createStudyGroup(createStudyGroupDto: CreateStudyGroupDto, creator: User): Promise<StudyGroup> {
        const studyGroup = this.studyGroupRepository.create({
            ...createStudyGroupDto,
            creator
        });

        return await this.studyGroupRepository.save(studyGroup);
    }

    async updateStudyGroup(
        id: number,
        updateStudyGroupDto: UpdateStudyGroupDto,
        user: User
    ): Promise<StudyGroup> {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
            relations: ['creator']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        if (studyGroup.creator.id !== user.id) {
            throw new UnauthorizedException('스터디 그룹을 수정할 권한이 없습니다.');
        }

        Object.assign(studyGroup, updateStudyGroupDto);
        return await this.studyGroupRepository.save(studyGroup);
    }

    async deleteStudyGroup(id: number, user: User): Promise<void> {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
            relations: ['creator']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        if (studyGroup.creator.id !== user.id) {
            throw new UnauthorizedException('스터디 그룹을 삭제할 권한이 없습니다.');
        }

        await this.studyGroupRepository.remove(studyGroup);
    }

    async findByCategory(
        mainCategory?: string,
        subCategory?: string,
        detailCategory?: string
    ): Promise<StudyGroup[]> {
        const queryBuilder = this.studyGroupRepository.createQueryBuilder('studyGroup')
            .leftJoinAndSelect('studyGroup.creator', 'creator')
            .orderBy('studyGroup.createdAt', 'DESC');

        if (mainCategory) {
            queryBuilder.andWhere('studyGroup.mainCategory = :mainCategory', { mainCategory });
        }
        if (subCategory) {
            queryBuilder.andWhere('studyGroup.subCategory = :subCategory', { subCategory });
        }
        if (detailCategory) {
            queryBuilder.andWhere('studyGroup.detailCategory = :detailCategory', { detailCategory });
        }

        return await queryBuilder.getMany();
    }

    async getStudyGroupCount(
        mainCategory?: string,
        subCategory?: string,
        detailCategory?: string
    ): Promise<number> {
        const queryBuilder = this.studyGroupRepository.createQueryBuilder('studyGroup');

        if (mainCategory) {
            queryBuilder.andWhere('studyGroup.mainCategory = :mainCategory', { mainCategory });
        }
        if (subCategory) {
            queryBuilder.andWhere('studyGroup.subCategory = :subCategory', { subCategory });
        }
        if (detailCategory) {
            queryBuilder.andWhere('studyGroup.detailCategory = :detailCategory', { detailCategory });
        }

        return await queryBuilder.getCount();
    }

    async getStudyGroupCountsByRegion(): Promise<Record<string, Record<string, number>>> {
        const studyGroups = await this.studyGroupRepository
            .createQueryBuilder('studyGroup')
            .select(['studyGroup.subCategory', 'studyGroup.detailCategory'])
            .where('studyGroup.mainCategory = :category', { category: '지역별' })
            .getMany();

        const counts: Record<string, Record<string, number>> = {};

        studyGroups.forEach(group => {
            if (!counts[group.subCategory]) {
                counts[group.subCategory] = {};
            }
            
            if (!counts[group.subCategory][group.detailCategory]) {
                counts[group.subCategory][group.detailCategory] = 0;
            }
            
            counts[group.subCategory][group.detailCategory]++;
            
            // '전체' 카운트 업데이트
            if (!counts[group.subCategory]['전체']) {
                counts[group.subCategory]['전체'] = 0;
            }
            counts[group.subCategory]['전체']++;
        });

        return counts;
    }
}
