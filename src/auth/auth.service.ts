import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/service/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }
        
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        
        const { password: _, ...result } = user;
        return result;
    }
}
