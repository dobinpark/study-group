/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FindPasswordDto } from '../dto/find-password.dto';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getUserProfile(username: string): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 비밀번호 필드 제외하고 반환
        const { password, ...result } = user;
        return result;
    }

    async updateUserProfile(username: string, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 비밀번호 변경 처리
        if (updateUserDto.currentPassword && updateUserDto.newPassword) {
            const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
            }

            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(updateUserDto.newPassword, salt);
        }

        // 이메일 중복 확인
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
            if (existingUser) {
                throw new ConflictException('이미 사용 중인 이메일입니다.');
            }
            user.email = updateUserDto.email;
        }

        // 나머지 필드 업데이트
        if (updateUserDto.nickname) user.nickname = updateUserDto.nickname;
        if (updateUserDto.phoneNumber) user.phoneNumber = updateUserDto.phoneNumber;

        await this.userRepository.save(user);

        // 비밀번호 필드 제외하고 반환
        const { password, ...result } = user;
        return result;
    }

    async findPassword(findPasswordDto: FindPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: findPasswordDto.username,
                email: findPasswordDto.email
            }
        });

        if (!user) {
            throw new NotFoundException('일치하는 사용자 정보를 찾을 수 없습니다.');
        }

        // 임시 비밀번호 생성 (8자리)
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // 새 비밀번호 해시화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        
        // 사용자 비밀번호 업데이트
        user.password = hashedPassword;
        await this.userRepository.save(user);

        // 임시 비밀번호 반환
        return { password: tempPassword };
    }

    async addRefreshToken(userId: number, token: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }

        user.refreshTokens.push({ token, expiresAt });
        await this.usersRepository.save(user);
    }

    async removeRefreshToken(userId: number, token: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || !user.refreshTokens) return;

        user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
        await this.usersRepository.save(user);
    }

    async validateRefreshToken(userId: number, token: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || !user.refreshTokens) return false;

        const tokenData = user.refreshTokens.find(t => t.token === token);
        if (!tokenData) return false;

        return new Date() < new Date(tokenData.expiresAt);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupExpiredTokens(): Promise<void> {
        const users = await this.usersRepository.find();
        const now = new Date();

        for (const user of users) {
            if (!user.refreshTokens) continue;

            const validTokens = user.refreshTokens.filter(
                token => new Date(token.expiresAt) > now
            );

            if (validTokens.length !== user.refreshTokens.length) {
                user.refreshTokens = validTokens;
                await this.usersRepository.save(user);
            }
        }
    }
}
