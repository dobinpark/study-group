import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../types/local.strategy';
import { SessionSerializer } from '../types/session.serializer';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ session: true }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        LocalStrategy,
        SessionSerializer
    ],
    exports: [AuthService],
})
export class AuthModule {}
