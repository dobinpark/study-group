import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../types/local.strategy';
import { SessionSerializer } from '../types/session.serializer';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ session: true }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    exports: [AuthService],
})
export class AuthModule { }
