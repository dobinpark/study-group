import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, In } from 'typeorm';
import { StudyGroup } from './entities/study-group.entity';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { User } from '../user/entities/user.entity';
import { CategoryDto } from './dto/category.dto';
import { Connection, DataSource } from 'typeorm';
import { StudyGroupJoinRequest, JoinRequestStatus } from './entities/study-group-join-request.entity';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';

@Injectable()
export class StudyGroupService {
    private readonly logger = new Logger(StudyGroupService.name);

    constructor(
        @InjectRepository(StudyGroup)
        private readonly studyGroupRepository: Repository<StudyGroup>,
        @InjectRepository(StudyGroupJoinRequest)
        private readonly joinRequestRepository: Repository<StudyGroupJoinRequest>,
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


    // 스터디 그룹 목록 조회
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
    async getMyStudies(userId: number | string): Promise<{ created: StudyGroup[], joined: StudyGroup[] }> {
        this.logger.debug(`getMyStudies - service - 메서드 진입`);
        this.logger.debug(`getMyStudies - service - userId 파라미터 타입 (타입 체크 전): ${typeof userId}`);

        // userId를 숫자로 변환
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

        if (isNaN(numericUserId)) {
            throw new BadRequestException(`유효하지 않은 사용자 ID입니다. 숫자 타입이 필요합니다. (현재 타입: ${typeof userId})`);
        }

        try {
            this.logger.debug(`getMyStudies - 사용자 ID: ${numericUserId}의 스터디 목록 조회 시작`);

            // [내가 생성한 스터디] 조회
            this.logger.debug(`getMyStudies - 사용자 ID: ${numericUserId}가 생성한 스터디 조회`);
            const created = await this.studyGroupRepository.find({
                where: { creatorId: numericUserId },
                relations: ['creator', 'members'],
                order: { createdAt: 'DESC' }
            });
            this.logger.debug(`getMyStudies - 생성한 스터디 조회 완료, 개수: ${created.length}`);

            // [내가 참여 중인 스터디] 조회 (내가 생성한 스터디는 제외)
            this.logger.debug(`getMyStudies - 사용자 ID: ${numericUserId}가 참여 중인 스터디 조회 (생성 스터디 제외)`);
            const joined = await this.studyGroupRepository.createQueryBuilder('group')
                .innerJoin('group.members', 'member', 'member.id = :userId', { userId: numericUserId })
                .leftJoinAndSelect('group.creator', 'creator')
                .leftJoinAndSelect('group.members', 'members')
                .where('group.creatorId != :userId', { userId: numericUserId }) // 자신이 생성한 스터디는 제외
                .orderBy('group.createdAt', 'DESC')
                .getMany();
            this.logger.debug(`getMyStudies - 참여 중인 스터디 조회 완료, 개수: ${joined.length}`);

            this.logger.debug(`getMyStudies - 사용자 ID: ${numericUserId}의 스터디 목록 조회 완료`);
            return {
                created,
                joined
            };

        } catch (error) {
            this.logger.error(`getMyStudies - 사용자 ID: ${numericUserId}의 스터디 목록 조회 중 오류 발생`, error);
            throw new InternalServerErrorException('내 스터디 목록을 조회하는 중 오류가 발생했습니다.');
        }
    }


    // 멤버 강제 탈퇴 (방장만 가능)
    async removeMember(groupId: number, memberId: number, requestUserId: number): Promise<void> {
        this.logger.debug(`removeMember - service - groupId: ${groupId}, memberId: ${memberId}, requestUserId: ${requestUserId}`);

        const studyGroup = await this.findOne(groupId);

        // 요청자가 방장인지 확인
        if (studyGroup.creator.id !== requestUserId) {
            throw new ForbiddenException('스터디 그룹의 방장만 멤버를 강제 탈퇴시킬 수 있습니다.');
        }

        // 강제 탈퇴 대상이 방장인지 확인
        if (memberId === studyGroup.creator.id) {
            throw new BadRequestException('방장은 강제 탈퇴시킬 수 없습니다.');
        }

        // 대상자가 스터디 멤버인지 확인
        const isMember = studyGroup.members.some(member => member.id === memberId);
        if (!isMember) {
            throw new BadRequestException('해당 사용자는 스터디 그룹의 멤버가 아닙니다.');
        }

        // 멤버 제거
        await this.studyGroupRepository
            .createQueryBuilder()
            .relation(StudyGroup, 'members')
            .of(studyGroup)
            .remove(memberId);

        // 현재 멤버 수 감소
        await this.studyGroupRepository.decrement({ id: groupId }, 'currentMembers', 1);

        this.logger.debug(`멤버 (ID: ${memberId}) 강제 탈퇴 완료 - 스터디 그룹 ID: ${groupId}`);
    }


    // 스터디 참여 요청 생성
    async createJoinRequest(
        studyGroupId: number,
        userId: number,
        createJoinRequestDto: CreateJoinRequestDto
    ): Promise<StudyGroupJoinRequest> {
        this.logger.debug(`참여 요청 생성 - studyGroupId: ${studyGroupId}, userId: ${userId}`);

        // 스터디 그룹 존재 확인
        const studyGroup = await this.findOne(studyGroupId);

        // 이미 멤버인지 확인 - members가 undefined인 경우를 대비하여 안전하게 처리
        const isMember = studyGroup.members && studyGroup.members.some(member => member && member.id === userId);
        if (isMember) {
            throw new BadRequestException('이미 스터디 그룹의 멤버입니다.');
        }

        // 이미 대기 중인 요청이 있는지 확인
        const existingRequest = await this.joinRequestRepository.findOne({
            where: {
                studyGroupId,
                userId,
                status: JoinRequestStatus.PENDING
            }
        });

        if (existingRequest) {
            throw new BadRequestException('이미 참여 요청을 보냈습니다. 방장의 승인을 기다려주세요.');
        }

        // 참여 요청 생성
        const joinRequest = this.joinRequestRepository.create({
            studyGroupId,
            userId,
            reason: createJoinRequestDto.reason,
            experience: createJoinRequestDto.experience,
            status: JoinRequestStatus.PENDING
        });

        return await this.joinRequestRepository.save(joinRequest);
    }


    // 대기 중인 참여 요청 목록 조회 (방장용)
    async getPendingJoinRequests(userId: number): Promise<StudyGroupJoinRequest[]> {
        this.logger.debug(`대기 중인 참여 요청 조회 - userId: ${userId}`);

        // 해당 사용자가 방장인 스터디 그룹 ID 목록 조회
        const ownedGroups = await this.studyGroupRepository.find({
            where: { creatorId: userId },
            select: ['id']
        });

        if (!ownedGroups.length) {
            return [];
        }

        const studyGroupIds = ownedGroups.map(group => group.id);

        // 해당 스터디 그룹들의 대기 중인 참여 요청 조회
        return await this.joinRequestRepository.find({
            where: {
                studyGroupId: In(studyGroupIds),
                status: JoinRequestStatus.PENDING
            },
            relations: ['user', 'studyGroup'],
            order: { createdAt: 'DESC' }
        });
    }


    // 참여 요청 승인
    async approveJoinRequest(studyGroupId: number, requestId: number, userId: number): Promise<void> {
        this.logger.debug(`참여 요청 승인 - studyGroupId: ${studyGroupId}, requestId: ${requestId}, userId: ${userId}`);

        // 요청 존재 확인
        const joinRequest = await this.joinRequestRepository.findOne({
            where: { id: requestId, studyGroupId },
            relations: ['studyGroup']
        });

        if (!joinRequest) {
            throw new NotFoundException('참여 요청을 찾을 수 없습니다.');
        }

        // 스터디 그룹 확인
        const studyGroup = await this.findOne(studyGroupId);

        // 요청자가 방장인지 확인
        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹의 방장만 참여 요청을 승인할 수 있습니다.');
        }

        // 이미 처리된 요청인지 확인
        if (joinRequest.status !== JoinRequestStatus.PENDING) {
            throw new BadRequestException('이미 처리된 참여 요청입니다.');
        }

        // 스터디 그룹이 가득 찼는지 확인
        if (studyGroup.currentMembers >= studyGroup.maxMembers) {
            throw new BadRequestException('스터디 그룹이 가득 찼습니다.');
        }

        // 트랜잭션 시작
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 참여 요청 상태 업데이트
            joinRequest.status = JoinRequestStatus.APPROVED;
            await queryRunner.manager.save(joinRequest);

            // 멤버 추가
            await queryRunner.manager
                .createQueryBuilder()
                .relation(StudyGroup, 'members')
                .of(studyGroup)
                .add(joinRequest.userId);

            // 현재 멤버 수 증가
            await queryRunner.manager.increment(
                StudyGroup,
                { id: studyGroupId },
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


    // 참여 요청 거절
    async rejectJoinRequest(studyGroupId: number, requestId: number, userId: number): Promise<void> {
        this.logger.debug(`참여 요청 거절 - studyGroupId: ${studyGroupId}, requestId: ${requestId}, userId: ${userId}`);

        // 요청 존재 확인
        const joinRequest = await this.joinRequestRepository.findOne({
            where: { id: requestId, studyGroupId }
        });

        if (!joinRequest) {
            throw new NotFoundException('참여 요청을 찾을 수 없습니다.');
        }

        // 스터디 그룹 확인
        const studyGroup = await this.findOne(studyGroupId);

        // 요청자가 방장인지 확인
        if (studyGroup.creator.id !== userId) {
            throw new ForbiddenException('스터디 그룹의 방장만 참여 요청을 거절할 수 있습니다.');
        }

        // 이미 처리된 요청인지 확인
        if (joinRequest.status !== JoinRequestStatus.PENDING) {
            throw new BadRequestException('이미 처리된 참여 요청입니다.');
        }

        // 참여 요청 상태 업데이트
        joinRequest.status = JoinRequestStatus.REJECTED;
        await this.joinRequestRepository.save(joinRequest);
    }


    // 참여 요청 상태 확인
    async checkJoinRequestStatus(studyGroupId: number, userId: number): Promise<{ status: JoinRequestStatus | null }> {
        this.logger.debug(`참여 요청 상태 확인 - studyGroupId: ${studyGroupId}, userId: ${userId}`);
        
        // 가장 최근 참여 요청 조회
        const joinRequest = await this.joinRequestRepository.findOne({
            where: { studyGroupId, userId },
            order: { createdAt: 'DESC' }
        });
        
        return {
            status: joinRequest ? joinRequest.status : null
        };
    }


    // 참여한 스터디 그룹의 읽지 않은 공지사항 수 가져오기
    async getUnreadNoticesCount(userId: number): Promise<number> {
        try {
            // 사용자가 참여한 스터디 그룹 목록 가져오기
            const participatingGroups = await this.studyGroupRepository
                .createQueryBuilder('studyGroup')
                .innerJoin('studyGroup.members', 'member', 'member.id = :userId', { userId })
                .getMany();

            // 현재는 실제 공지사항 테이블이 없으므로 임시로 0을 반환
            // 공지사항 기능이 구현되면 아래 주석을 해제하고 실제 코드로 대체
            /*
            // 참여한 스터디 그룹의 공지사항 중 읽지 않은 것 카운트
            const unreadCount = await this.noticeRepository
                .createQueryBuilder('notice')
                .innerJoin('notice.studyGroup', 'studyGroup')
                .leftJoin('notice.readBy', 'readBy', 'readBy.userId = :userId', { userId })
                .where('studyGroup.id IN (:...groupIds)', { 
                    groupIds: participatingGroups.map(group => group.id) 
                })
                .andWhere('readBy.id IS NULL')
                .getCount();
            
            return unreadCount;
            */
            
            // 임시 구현: 각 그룹당 1개의 읽지 않은 공지사항이 있다고 가정
            return participatingGroups.length;
        } catch (error) {
            this.logger.error(`읽지 않은 공지사항 수 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            return 0; // 오류 발생 시 0을 반환
        }
    }
}
