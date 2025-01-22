import { Inject, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from '../entities/study-group.entity';
import { CreateStudyGroupDto } from '../dto/create-study-group.dto';
import { UpdateStudyGroupDto } from '../dto/update-study-group.dto';
import { User } from '../../user/users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StudyGroupService {
    constructor(
        @InjectRepository(StudyGroup)
        private studyGroupRepository: Repository<StudyGroup>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async createStudyGroup(createStudyGroupDto: CreateStudyGroupDto, user: User): Promise<StudyGroup> {
        const studyGroup = this.studyGroupRepository.create({
            ...createStudyGroupDto,
            creator: user,
            members: [user]
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

        // 기존 카테고리 정보 저장
        const oldMainCategory = studyGroup.mainCategory;
        const oldSubCategory = studyGroup.subCategory;
        const oldDetailCategory = studyGroup.detailCategory;

        Object.assign(studyGroup, updateStudyGroupDto);
        const updatedStudyGroup = await this.studyGroupRepository.save(studyGroup);

        // 기존 카테고리의 캐시 무효화
        await this.invalidateCache(oldMainCategory, oldSubCategory, oldDetailCategory);
        // 새로운 카테고리의 캐시 무효화
        await this.invalidateCache(studyGroup.mainCategory, studyGroup.subCategory, studyGroup.detailCategory);

        return updatedStudyGroup;
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
        const cacheKey = `study_groups:${mainCategory}:${subCategory}:${detailCategory}`;
        
        // 캐시 확인
        const cachedData = await this.cacheManager.get<StudyGroup[]>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // DB 조회
        const queryBuilder = this.studyGroupRepository.createQueryBuilder('studyGroup')
            .leftJoinAndSelect('studyGroup.creator', 'creator')
            .leftJoinAndSelect('studyGroup.members', 'members')
            .orderBy('studyGroup.createdAt', 'DESC')
            .where('1 = 1');  // 기본 조건

        if (mainCategory) {
            queryBuilder.andWhere('studyGroup.mainCategory = :mainCategory', { mainCategory });
        }
        
        if (subCategory && subCategory !== '전체') {
            queryBuilder.andWhere('studyGroup.subCategory = :subCategory', { subCategory });
        } else if (subCategory === '전체' && mainCategory) {
            // mainCategory가 있고 subCategory가 '전체'인 경우, 해당 mainCategory의 모든 스터디 그룹을 조회
            queryBuilder.andWhere('studyGroup.mainCategory = :mainCategory', { mainCategory });
        }
        
        if (detailCategory && detailCategory !== '전체') {
            queryBuilder.andWhere('studyGroup.detailCategory = :detailCategory', { detailCategory });
        }

        const results = await queryBuilder.getMany();
        
        // 캐시 저장 (5분)
        await this.cacheManager.set(cacheKey, results, 300000);
        
        return results;
    }

    // 캐시 무효화 처리
    async invalidateCache(mainCategory?: string, subCategory?: string, detailCategory?: string) {
        const cacheKey = `study_groups:${mainCategory}:${subCategory}:${detailCategory}`;
        await this.cacheManager.del(cacheKey);
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

    async findAll(params: {
        mainRegion?: string;
        subRegion?: string;
        mainCategory?: string;
    }) {
        const query = this.studyGroupRepository.createQueryBuilder('studyGroup')
            .leftJoinAndSelect('studyGroup.creator', 'creator');
    
        if (params.mainCategory === '지역별') {
            query.where('studyGroup.mainCategory = :mainCategory', { mainCategory: params.mainCategory });
            
            if (params.mainRegion) {
                query.andWhere('studyGroup.subCategory = :mainRegion', { mainRegion: params.mainRegion });
                
                if (params.subRegion && params.subRegion !== '전체') {
                    query.andWhere('studyGroup.detailCategory = :subRegion', { subRegion: params.subRegion });
                }
            }
        }
    
        return await query.getMany();
    }

    async joinStudyGroup(studyGroupId: number, user: User): Promise<StudyGroup> {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id: studyGroupId },
            relations: ['members']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        if (studyGroup.members.length >= studyGroup.maxMembers) {
            throw new BadRequestException('스터디 그룹이 가득 찼습니다.');
        }

        if (studyGroup.members.some(member => member.id === user.id)) {
            throw new BadRequestException('이미 참여중인 스터디 그룹입니다.');
        }

        studyGroup.members.push(user);
        return await this.studyGroupRepository.save(studyGroup);
    }

    async getStudyGroupDetails(id: number): Promise<StudyGroup> {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
            relations: ['creator', 'members']
        });

        if (!studyGroup) {
            throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        return studyGroup;
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

    async getMyStudyGroups(user: User): Promise<{ created: StudyGroup[], joined: StudyGroup[] }> {
        try {
            if (!user || !user.id) {
                throw new UnauthorizedException('유효한 사용자 정보가 없습니다.');
            }

            // 내가 생성한 스터디
            const created = await this.studyGroupRepository.find({
                where: { creator: { id: user.id } },
                relations: ['creator', 'members'],
                order: { createdAt: 'DESC' }
            });

            // 내가 참여한 스터디 (생성한 스터디 제외)
            const joined = await this.studyGroupRepository
                .createQueryBuilder('studyGroup')
                .leftJoinAndSelect('studyGroup.creator', 'creator')
                .leftJoinAndSelect('studyGroup.members', 'members')
                .innerJoin('studyGroup.members', 'member', 'member.id = :userId', { userId: user.id })
                .where('creator.id != :userId', { userId: user.id })
                .orderBy('studyGroup.createdAt', 'DESC')
                .getMany();

            console.log('사용자 ID:', user.id);
            console.log('생성한 스터디:', created);
            console.log('참여한 스터디:', joined);

            return { created, joined };
        } catch (error) {
            console.error('내 스터디 조회 중 오류 발생:', error);
            throw error;
        }
    }
}
