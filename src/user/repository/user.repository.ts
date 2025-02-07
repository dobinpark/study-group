import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
}
