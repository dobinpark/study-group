import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../users/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: { username: string }): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
