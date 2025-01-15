import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { 
                    expiresIn: '1h',
                },
            }),
        }),
        TypeOrmModule.forFeature([RefreshToken]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenRepository],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
