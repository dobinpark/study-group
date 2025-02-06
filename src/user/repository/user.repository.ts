import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
    async findOneByUsername(username: string): Promise<User | null> {
        return this.findOne({ where: { username } });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.create({
            ...userData,
            role: userData.role || UserRole.USER,
        });
        return this.save(user);
    }
}
