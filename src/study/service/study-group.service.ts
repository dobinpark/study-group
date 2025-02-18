import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { StudyGroup } from '../entities/study-group.entity';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/entities/user.entity';
import { CategoryDto } from '../dto/category.dto';

@Injectable()
export class StudyGroupService {
    constructor(
        @InjectRepository(StudyGroup)
        private studyGroupRepository: Repository<StudyGroup>
    ) {}

    // 스터디 그룹 목록 조회
    async findAll(params: {
        mainCategory?: string;
        subCategory?: string;
        detailCategory?: string;
        search?: string;
    }): Promise<StudyGroup[]> {
        try {
            const where: FindOptionsWhere<StudyGroup> = {};

            if (params.mainCategory) {
                where.mainCategory = params.mainCategory;
            }
            if (params.subCategory) {
                where.subCategory = params.subCategory;
            }
            if (params.detailCategory) {
                where.detailCategory = params.detailCategory;
            }
            if (params.search) {
                where.name = Like(`%${params.search}%`);
            }

            return await this.studyGroupRepository.find({
                where,
                relations: ['creator', 'members'],
                order: { createdAt: 'DESC' }
            });
        } catch (error) {
            throw new InternalServerErrorException('스터디 그룹 목록 조회 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 생성
    async createStudyGroup(createStudyGroupDto: CreateStudyGroupDto, creator: User): Promise<StudyGroup> {
        try {
            const studyGroup = new StudyGroup();
            Object.assign(studyGroup, {
            ...createStudyGroupDto,
                creator,
                members: [creator],
                currentMembers: 1
        });

        return await this.studyGroupRepository.save(studyGroup);
        } catch (error) {
            throw new InternalServerErrorException('스터디 그룹 생성 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 상세 조회
    async findStudyGroupById(id: number): Promise<StudyGroup> {
        try {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
                relations: ['creator', 'members']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

            return studyGroup;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('스터디 그룹 조회 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 수정
    async updateStudyGroup(id: number, updateStudyGroupDto: UpdateStudyGroupDto): Promise<StudyGroup> {
        try {
            const studyGroup = await this.findStudyGroupById(id);
            
            // 수정할 필드들을 업데이트
        Object.assign(studyGroup, updateStudyGroupDto);
            
        return await this.studyGroupRepository.save(studyGroup);
        } catch (error) {
            throw new InternalServerErrorException('스터디 그룹 수정 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 삭제
    async deleteStudyGroup(id: number): Promise<void> {
        try {
            const result = await this.studyGroupRepository.delete(id);
            if (result.affected === 0) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('스터디 그룹 삭제 중 오류가 발생했습니다.');
        }
    }

    // 카테고리별 스터디 그룹 수 조회
    async getStudyGroupCountsByCategory(): Promise<CategoryDto[]> {
        try {
            const categories = await this.studyGroupRepository
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

            return categories.map(category => ({
                mainCategory: category.studyGroup_mainCategory,
                subCategory: category.studyGroup_subCategory,
                detailCategory: category.studyGroup_detailCategory,
                count: parseInt(category.count)
            }));
        } catch (error) {
            throw new InternalServerErrorException('카테고리별 스터디 그룹 수 조회 중 오류가 발생했습니다.');
        }
    }

    // 스터디 그룹 참여
    async joinStudyGroup(id: number, user: User): Promise<StudyGroup> {
        try {
            const studyGroup = await this.findStudyGroupById(id);

            // 이미 참여한 멤버인지 확인
            if (studyGroup.members.some(member => member.id === user.id)) {
                throw new BadRequestException('이미 참여 중인 스터디 그룹입니다.');
            }

            // 최대 인원 초과 확인
            if (studyGroup.currentMembers >= studyGroup.maxMembers) {
                throw new BadRequestException('스터디 그룹의 최대 인원이 초과되었습니다.');
            }

            // 멤버 추가 및 현재 인원 수 증가
            studyGroup.members.push(user);
            studyGroup.currentMembers += 1;

            return await this.studyGroupRepository.save(studyGroup);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('스터디 그룹 참여 중 오류가 발생했습니다.');
        }
    }

    // 내 스터디 그룹 목록 조회 (생성 + 참여)
    async findMyStudyGroups(user: User): Promise<StudyGroup[]> {
        try {
            return await this.studyGroupRepository
                .createQueryBuilder('studyGroup')
                .leftJoinAndSelect('studyGroup.creator', 'creator')
                .leftJoinAndSelect('studyGroup.members', 'members')
                .where('creator.id = :userId', { userId: user.id })
                .orWhere('members.id = :userId', { userId: user.id })
                .orderBy('studyGroup.createdAt', 'DESC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException('내 스터디 그룹 목록 조회 중 오류가 발생했습니다.');
        }
    }

    // 내가 생성한 스터디 그룹 목록 조회
    async findMyCreatedStudyGroups(user: User): Promise<StudyGroup[]> {
        try {
            return await this.studyGroupRepository.find({
                where: { creator: { id: user.id } },
                relations: ['creator', 'members'],
                order: { createdAt: 'DESC' }
            });
        } catch (error) {
            throw new InternalServerErrorException('내가 생성한 스터디 그룹 목록 조회 중 오류가 발생했습니다.');
        }
    }

    // 내가 참여한 스터디 그룹 목록 조회
    async findMyJoinedStudyGroups(user: User): Promise<StudyGroup[]> {
        try {
            return await this.studyGroupRepository
                .createQueryBuilder('studyGroup')
                .leftJoinAndSelect('studyGroup.creator', 'creator')
                .leftJoinAndSelect('studyGroup.members', 'members')
                .where('members.id = :userId', { userId: user.id })
                .andWhere('creator.id != :userId', { userId: user.id })
                .orderBy('studyGroup.createdAt', 'DESC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException('내가 참여한 스터디 그룹 목록 조회 중 오류가 발생했습니다.');
        }
    }
}
