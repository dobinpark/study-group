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

@Injectable()
export class UsersService {
    private readonly USER_PROFILE_CACHE_TTL = 600; // 10분
    private readonly USER_PROFILE_CACHE_PREFIX = 'user:profile:';
    private readonly SALT_ROUNDS = 10;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        await this.userRepository.save({
            ...userCredentialsDto,
            password: hashedPassword,
        });
    }

    async login(userCredentialsDto: UserCredentialsDto): Promise<User> {
        const { username, password } = userCredentialsDto;
        return this.validateUser(username, password);
    }

    private async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async getUserProfile(username: string): Promise<Partial<User> | null> {
        const cacheKey = this.getCacheKey(username);
        const cachedProfile = await this.cacheManager.get<Partial<User>>(cacheKey);

        if (cachedProfile) {
            return cachedProfile;
        }

        const user = await this.findUserByUsername(username);

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        const profile = this.excludeSensitiveFields(user);
        await this.cacheManager.set(cacheKey, profile, this.USER_PROFILE_CACHE_TTL * 1000);
        return profile;
    }

    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<Partial<User> | null> {
        const cacheKey = this.getCacheKey(username);
        const updatedProfile = await this._updateUserProfile(username, updateUserDto);

        if (updatedProfile) {
            await this.cacheManager.del(cacheKey);
        }
        return updatedProfile;
    }

    private async _updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<Partial<User> | null> {
        try {
            const user = await this.findUserByUsername(username);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const result = await this.userRepository.update(user.id, updateUserDto);
            if (result.affected === 0) {
                return null;
            }

            const updatedUser = await this.findUserByUsername(username);
            return this.excludeSensitiveFields(updatedUser);

        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new InternalServerErrorException('Failed to update user profile');
        }
    }

    private getCacheKey(username: string): string {
        return `${this.USER_PROFILE_CACHE_PREFIX}${username}`;
    }

    private excludeSensitiveFields(user: User | undefined | null): Partial<User> | null {
        if (!user) return null;
        const { password, ...rest } = user;
        return rest;
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

            const hashedPassword = await bcrypt.hash(tempPassword, this.SALT_ROUNDS);

            await this.userRepository.update(user.id, { password: hashedPassword });

            return { tempPassword };

        } catch (error) {
            console.error("Error finding or updating password:", error);
            throw new InternalServerErrorException('Failed to process password request');
        }
    }

    async logout(): Promise<void> {
        // 로그아웃 로직을 여기에 추가합니다.
        // 예를 들어, 클라이언트 측에서 토큰을 삭제하도록 안내할 수 있습니다.
        // 서버 측에서 특별히 할 작업이 없다면 빈 메서드로 둘 수 있습니다.
    }
}