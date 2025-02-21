import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AuthSignupDto } from '../dto/auth.signUp.dto';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(signupData: Omit<AuthSignupDto, 'confirmPassword'> & { password: string }): Promise<User> {
        const user = this.userRepository.create(signupData);
        return await this.userRepository.save(user);
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async updatePassword(userId: number, hashedPassword: string): Promise<void> {
        await this.userRepository.update(userId, { password: hashedPassword });
    }
}
