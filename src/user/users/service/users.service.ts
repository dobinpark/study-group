/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FindPasswordDto } from '../dto/find-password.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
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
}
