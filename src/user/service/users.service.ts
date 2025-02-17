import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { LoginDto } from '../dto/login.dto';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    private static readonly USER_PROFILE_CACHE_TTL = 600;
    private static readonly USER_PROFILE_CACHE_PREFIX = 'user:profile:';
    private static readonly SALT_ROUNDS = 10;

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
        const { password, confirmPassword, username } = userCredentialsDto;

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequestException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, UsersService.SALT_ROUNDS);

        try {
            await this.userRepository.save({
                ...userCredentialsDto,
                password: hashedPassword,
            });
        } catch (error) {
            console.error('회원 가입 중 데이터베이스 오류 발생:', error);
            throw new InternalServerErrorException('Failed to sign up user');
        }
    }

    async getUserProfile(username: string): Promise<UserProfileResponseDto> {
        const profile = await this.userRepository.findOne({ where: { username } });
        if (!profile) {
            throw new NotFoundException('User profile not found');
        }
        return this.excludeSensitiveFieldsToProfileDto(profile) as UserProfileResponseDto;
    }

    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto | null> {
        const cacheKey = this.getCacheKey(username);
        const updatedProfile = await this._updateUserProfile(username, updateUserDto);

        if (updatedProfile) {
            await this.cacheManager.del(cacheKey);
        }
        return updatedProfile;
    }

    private async _updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto | null> {
        try {
            const user = await this.findUserByUsername(username);
            if (!user) {
                throw new NotFoundException(`User with username '${username}' not found`);
            }

            const updateData: Partial<User> = {};

            if (updateUserDto.currentPassword) {
                const isPasswordMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
                if (!isPasswordMatch) {
                    throw new BadRequestException('Invalid current password');
                }
                if (updateUserDto.newPassword) {
                    updateData.password = await bcrypt.hash(updateUserDto.newPassword, UsersService.SALT_ROUNDS);
                }
            }

            if (updateUserDto.nickname !== undefined) {
                updateData.nickname = updateUserDto.nickname;
            }
            if (updateUserDto.email !== undefined) {
                updateData.email = updateUserDto.email;
            }
            if (updateUserDto.phoneNumber !== undefined) {
                updateData.phoneNumber = updateUserDto.phoneNumber;
            }

            const updateResult = await this.userRepository.update(user.id, updateData);
            if (updateResult.affected === 0) {
                return null;
            }

            const updatedUser = await this.findUserByUsername(username);
            return this.excludeSensitiveFieldsToProfileDto(updatedUser);

        } catch (error) {
            console.error('사용자 프로필 업데이트 오류:', error);
            throw new InternalServerErrorException('Failed to update user profile');
        }
    }

    private getCacheKey(username: string): string {
        return `${UsersService.USER_PROFILE_CACHE_PREFIX}${username}`;
    }

    private excludeSensitiveFieldsToProfileDto(user: User | undefined | null): UserProfileResponseDto | null {
        if (!user) return null;
        const { password, ...rest } = user;
        return rest as UserProfileResponseDto;
    }

    async findUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findPassword(findPasswordDto: FindPasswordDto): Promise<{ tempPassword: string }> {
        try {
            const { username, email } = findPasswordDto;

            const user = await this.userRepository.findOne({ where: { username, email } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const tempPassword = uuidv4().slice(0, 12);

            const hashedPassword = await bcrypt.hash(tempPassword, UsersService.SALT_ROUNDS);

await this.userRepository.update(user.id, { password: hashedPassword });

            return { tempPassword };

        } catch (error) {
            console.error('비밀번호 찾기 처리 오류:', error);
            throw new InternalServerErrorException('Failed to process password request');
        }
    }

    async logout(): Promise<void> {
        // 세션 기반 인증에서는 서비스 레벨에서 로그아웃 로직이 필요 없음
        // Controller 에서 req.session.destroy() 를 통해 세션 삭제
    }
}
