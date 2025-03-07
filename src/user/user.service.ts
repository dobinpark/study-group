import { Injectable, NotFoundException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/user.userUpdate.dto';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { UserProfileResponseDto } from './dto/user.profileResponse.dto';

@Injectable()
export class UserService {

    private static readonly USER_PROFILE_CACHE_PREFIX = 'user:profile:';
    private static readonly USER_PROFILE_CACHE_TTL = 600;
    private static readonly SALT_ROUNDS = 10;
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) { }


    // 사용자 조회 (예외 처리 적용)
    async findUserByUsername(username: string): Promise<User> { // Promise<User> 로 반환 타입 변경
        this.logger.debug(`findUserByUsername 호출: username = ${username}`);
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            this.logger.warn(`findUserByUsername: 사용자를 찾을 수 없음 - username = ${username}`);
            throw new NotFoundException(`'${username}' 사용자를 찾을 수 없습니다.`); // NotFoundException 던지도록 수정
        }
        this.logger.debug(`findUserByUsername 완료: username = ${username}, userId = ${user.id}`);
        return user;
    }


    // 사용자 프로필 조회 (캐싱 적용)
    async getUserProfile(username: string): Promise<UserProfileResponseDto> {
        this.logger.debug(`getUserProfile 호출: username = ${username}`);
        const cacheKey = this.getCacheKey(username);

        // 캐시에서 프로필 조회 시도
        const cachedProfile = await this.cacheManager.get<UserProfileResponseDto>(cacheKey);
        if (cachedProfile) {
            this.logger.debug(`getUserProfile: 캐시에서 프로필 정보 조회 - username = ${username}`);
            return cachedProfile;
        }

        // 캐시에 없으면 DB에서 조회
        const profile = await this.findUserByUsername(username); // findUserByUsername 사용 (예외 처리 내장)
        const profileDto = this.excludeSensitiveFieldsToProfileDto(profile);

        // DB에서 조회한 프로필 정보 캐시에 저장
        await this.cacheManager.set(cacheKey, profileDto, UserService.USER_PROFILE_CACHE_TTL);
        this.logger.log(`getUserProfile: DB에서 프로필 정보 조회 및 캐시 저장 - username = ${username}`);
        return profileDto;
    }


    // 사용자 프로필 조회 (ID)
    async findUserProfileById(id: number): Promise<Omit<User, 'password'>> {
        this.logger.debug(`findUserProfileById 호출: id = ${id}`);
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            this.logger.warn(`findUserProfileById: 사용자를 찾을 수 없음 - id = ${id}`);
            throw new NotFoundException(`User with id ${id} not found`);
        }
        const { password, ...userProfile } = user;
        this.logger.debug(`findUserProfileById 완료: id = ${id}, username = ${user.username}`);
        return userProfile;
    }


    // 사용자 프로필 업데이트 (ID)
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        this.logger.debug(`updateUser 호출: id = ${id}`);
        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.findUserProfileById(id);
        this.logger.log(`updateUser 완료: id = ${id}, username = ${updatedUser.username}`);
        return updatedUser;
    }


    // 사용자 프로필 업데이트 (username, 캐싱 적용)
    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto> {
        this.logger.debug(`updateUserProfile 호출: username = ${username}`);
        const cacheKey = this.getCacheKey(username);
        const updatedProfile = await this._updateUserProfile(username, updateUserDto);

        if (updatedProfile) {
            await this.cacheManager.del(cacheKey); // 캐시 삭제
            this.logger.log(`updateUserProfile: 캐시 삭제 - username = ${username}`);
        }
        this.logger.log(`updateUserProfile 완료: username = ${username}`);
        return updatedProfile;
    }


    // 사용자 프로필 업데이트 (username, 실제 업데이트 로직)
    private async _updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto> {
        this.logger.debug(`_updateUserProfile 호출: username = ${username}`);
        try {
            const user = await this.findUserByUsername(username); // findUserByUsername 사용 (예외 처리 내장)
            const updateData: Partial<User> = {};

            if (updateUserDto.currentPassword) {
                const isPasswordMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
                if (!isPasswordMatch) {
                    this.logger.warn(`_updateUserProfile: 현재 비밀번호 불일치 - username = ${username}`);
                    throw new BadRequestException('현재 비밀번호가 일치하지 않습니다. 비밀번호를 다시 확인해주세요.'); // 에러 메시지 구체화
                }
                if (updateUserDto.newPassword) {
                    if (updateUserDto.currentPassword === updateUserDto.newPassword) {
                        this.logger.warn(`_updateUserProfile: 새 비밀번호가 현재 비밀번호와 동일 - username = ${username}`);
                        throw new BadRequestException('새 비밀번호는 현재 비밀번호와 달라야 합니다.'); // 에러 메시지 구체화
                    }
                    updateData.password = await bcrypt.hash(updateUserDto.newPassword, UserService.SALT_ROUNDS);
                }
            }

            if (updateUserDto.nickname !== undefined && updateUserDto.nickname !== user.nickname) {
                const existingNickname = await this.userRepository.findOne({
                    where: { nickname: updateUserDto.nickname }
                });
                if (existingNickname) {
                    this.logger.warn(`_updateUserProfile: 닉네임 중복 - username = ${username}, nickname = ${updateUserDto.nickname}`);
                    throw new BadRequestException('이미 사용 중인 닉네임입니다.'); // 에러 메시지 구체화
                }
                updateData.nickname = updateUserDto.nickname;
            }

            if (updateUserDto.email !== undefined && updateUserDto.email !== user.email) {
                const existingEmail = await this.userRepository.findOne({
                    where: { email: updateUserDto.email }
                });
                if (existingEmail) {
                    this.logger.warn(`_updateUserProfile: 이메일 중복 - username = ${username}, email = ${updateUserDto.email}`);
                    throw new BadRequestException('이미 사용 중인 이메일입니다.'); // 에러 메시지 구체화
                }
                updateData.email = updateUserDto.email;
            }

            if (updateUserDto.phoneNumber !== undefined) {
                updateData.phoneNumber = updateUserDto.phoneNumber;
            }

            const updateResult = await this.userRepository.update(user.id, updateData);
            if (updateResult.affected === 0) {
                this.logger.error(`_updateUserProfile: 프로필 업데이트 실패 (DB 업데이트 실패) - username = ${username}`);
                throw new NotFoundException('프로필 업데이트에 실패했습니다.'); // 에러 메시지 구체화
            }

            const updatedUser = await this.findUserByUsername(username); // findUserByUsername 사용 (예외 처리 내장)
            this.logger.log(`_updateUserProfile 완료: username = ${username}`);
            return this.excludeSensitiveFieldsToProfileDto(updatedUser);

        } catch (error) {
            this.logger.error(`_updateUserProfile 오류 발생: username = ${username}`, error);
            throw error;
        }
    }


    // 캐시 키 생성
    private getCacheKey(username: string): string {
        return `${UserService.USER_PROFILE_CACHE_PREFIX}${username}`;
    }


    // 민감한 필드 제외하여 프로필 DTO로 변환
    private excludeSensitiveFieldsToProfileDto(user: User): UserProfileResponseDto {
        const { password, ...rest } = user;
        return rest as UserProfileResponseDto;
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
}
