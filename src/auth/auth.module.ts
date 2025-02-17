import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './service/refresh-token.service';

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                verifyOptions: { ignoreExpiration: false },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([RefreshToken]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RefreshTokenService],
    exports: [AuthService, JwtStrategy, JwtAuthGuard, PassportModule, JwtModule, RefreshTokenService],
})
export class AuthModule {}
