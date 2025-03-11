import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from '../types/session.serializer';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UserModule,
        PassportModule.register({ session: true }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        LocalStrategy,
        UserService,
        SessionSerializer,
        AuthGuard,
    ],
    exports: [AuthService, AuthGuard],
})
export class AuthModule { }
