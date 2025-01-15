import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCredentialsDto } from '../../auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password, email, nickname, phoneNumber } = authCredentialsDto;

        // 이메일 중복 확인
        const existingEmail = await this.findOne({ where: { email } });
        if (existingEmail) {
            throw new ConflictException('이미 사용 중인 이메일입니다.');
        }

        // 사용자명 중복 확인
        const existingUsername = await this.findOne({ where: { username } });
        if (existingUsername) {
            throw new ConflictException('이미 사용 중인 사용자명입니다.');
        }

        // 비밀번호 해싱
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // 새 사용자 생성
        const user = this.create({
            username,
            password: hashedPassword,
            email,
            nickname,
            phoneNumber
        });

        try {
            // 사용자 저장
            await this.save(user);
            return user;
        } catch (error) {
            throw new InternalServerErrorException('사용자 생성 중 오류가 발생했습니다.');
        }
    }
}
