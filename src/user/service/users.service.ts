import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindPasswordDto } from '../dto/find-password.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { LoginDto } from '../dto/login.dto';
import { UserProfileResponseDto } from '../dto/user-profile.response.dto';

interface SessionUser {
    id: number;
    username: string;
    nickname: string;
    email: string;
    role: UserRole;
}

@Injectable()
export class UsersService {
    private static readonly USER_PROFILE_CACHE_TTL = 600;
    private static readonly USER_PROFILE_CACHE_PREFIX = 'user:profile:';
    private static readonly SALT_ROUNDS = 10;
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async signUp(userCredentialsDto: UserCredentialsDto): Promise<{ success: boolean; message: string }> {
        const { password, confirmPassword, username } = userCredentialsDto;

        if (password !== confirmPassword) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }

        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequestException('이미 존재하는 아이디입니다.');
        }

        const hashedPassword = await bcrypt.hash(password, UsersService.SALT_ROUNDS);

        try {
            await this.userRepository.save({
                ...userCredentialsDto,
                password: hashedPassword,
            });
            this.logger.log(`User ${userCredentialsDto.username} signed up successfully.`);
            return {
                success: true,
                message: '회원가입이 완료되었습니다.'
            };
        } catch (error) {
            this.logger.error(`Error signing up user ${userCredentialsDto.username}`, (error as Error).stack);
            throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.');
        }
    }

    async getUserProfile(username: string): Promise<UserProfileResponseDto> {
        const profile = await this.userRepository.findOne({ where: { username } });
        if (!profile) {
            throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
        }
        return this.excludeSensitiveFieldsToProfileDto(profile) as UserProfileResponseDto;
    }

    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponseDto> {
        const cacheKey = this.getCacheKey(username);
        const updatedProfile = await this._updateUserProfile(username, updateUserDto);

        if (updatedProfile) {
            await this.cacheManager.del(cacheKey);
        }
        return updatedProfile;
    }

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
                    updateData.password = await bcrypt.hash(updateUserDto.newPassword, UsersService.SALT_ROUNDS);
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

    private getCacheKey(username: string): string {
        return `${UsersService.USER_PROFILE_CACHE_PREFIX}${username}`;
    }

    private excludeSensitiveFieldsToProfileDto(user: User | undefined | null): UserProfileResponseDto {
        if (!user) {
            throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
        }
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
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const tempPassword = uuidv4().slice(0, 12);

            const hashedPassword = await bcrypt.hash(tempPassword, UsersService.SALT_ROUNDS);

            await this.userRepository.update(user.id, { password: hashedPassword });

            return { tempPassword };

        } catch (error) {
            console.error('비밀번호 찾기 처리 오류:', error);
            throw new InternalServerErrorException('비밀번호 찾기 처리 오류');
        }
    }

    async logout(): Promise<void> {
        // 세션 기반 인증에서는 서비스 레벨에서 로그아웃 로직이 필요 없음
        // Controller 에서 req.session.destroy() 를 통해 세션 삭제
    }
}
