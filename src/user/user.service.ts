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

    // 사용자 조회
    async findUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    // 사용자 프로필 조회
    async findUserProfileById(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        const { password, ...userProfile } = user;
        return userProfile;
    }

    // 사용자 프로필 업데이트
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.findUserProfileById(id);
        return updatedUser;
    }

    // 사용자 프로필 조회
    async getUserProfile(username: string): Promise<UserProfileResponseDto> {
        const profile = await this.userRepository.findOne({ where: { username } });
        if (!profile) {
            throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
        }
        return this.excludeSensitiveFieldsToProfileDto(profile);
    }

    // 사용자 프로필 업데이트
    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto> {
        const cacheKey = this.getCacheKey(username);
        const updatedProfile = await this._updateUserProfile(username, updateUserDto);

        if (updatedProfile) {
            await this.cacheManager.del(cacheKey);
        }
        return updatedProfile;
    }

    // 사용자 프로필 업데이트
    private async _updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto> {
        try {
            const user = await this.findUserByUsername(username);
            if (!user) {
                throw new NotFoundException(`'${username}' 사용자를 찾을 수 없습니다.`);
            }

            const updateData: Partial<User> = {};

            if (updateUserDto.currentPassword) {
                const isPasswordMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
                if (!isPasswordMatch) {
                    throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
                }
                if (updateUserDto.newPassword) {
                    if (updateUserDto.currentPassword === updateUserDto.newPassword) {
                        throw new BadRequestException('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
                    }
                    updateData.password = await bcrypt.hash(updateUserDto.newPassword, UserService.SALT_ROUNDS);
                }
            }
            
            if (updateUserDto.nickname !== undefined && updateUserDto.nickname !== user.nickname) {
                const existingNickname = await this.userRepository.findOne({
                    where: { nickname: updateUserDto.nickname }
                });
                if (existingNickname) {
                    throw new BadRequestException('이미 사용 중인 닉네임입니다.');
                }
                updateData.nickname = updateUserDto.nickname;
            }

            if (updateUserDto.email !== undefined && updateUserDto.email !== user.email) {
                const existingEmail = await this.userRepository.findOne({
                    where: { email: updateUserDto.email }
                });
                if (existingEmail) {
                    throw new BadRequestException('이미 사용 중인 이메일입니다.');
                }
                updateData.email = updateUserDto.email;
            }

            if (updateUserDto.phoneNumber !== undefined) {
                updateData.phoneNumber = updateUserDto.phoneNumber;
            }

            const updateResult = await this.userRepository.update(user.id, updateData);
            if (updateResult.affected === 0) {
                throw new NotFoundException('프로필 업데이트에 실패했습니다.');
            }

            const updatedUser = await this.findUserByUsername(username);
            if (!updatedUser) {
                throw new NotFoundException(`'${username}' 사용자를 찾을 수 없습니다.`);
            }
            return this.excludeSensitiveFieldsToProfileDto(updatedUser);

        } catch (error) {
            console.error('사용자 프로필 업데이트 오류:', error);
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
}
