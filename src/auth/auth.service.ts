import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/service/users.service';
import { RefreshTokenService } from './service/refresh-token.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../user/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private refreshTokenService: RefreshTokenService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
            return null;
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return null;
        }
        const { password: hashedPassword, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string, user: any }> {
        const userEntity = await this.validateUser(loginDto.username, loginDto.password);
        if (!userEntity) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.refreshTokenService.deleteRefreshTokenForUser(userEntity);

        const payload = { username: userEntity.username, sub: userEntity.id };

        const accessToken = this.generateAccessToken(payload);
        const refreshTokenEntity = await this.generateRefreshTokenAndSaveToDb(userEntity, payload);

        return {
            accessToken: accessToken,
            refreshToken: refreshTokenEntity.token,
            user: {
                id: userEntity.id,
                username: userEntity.username,
                nickname: userEntity.nickname,
                email: userEntity.email,
                role: userEntity.role,
            }
        };
    }

    generateAccessToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '1h',
        });
    }

    async generateRefreshTokenAndSaveToDb(user: User, payload: any): Promise<RefreshToken> {
        const refreshTokenExpiryDate = await this.refreshTokenService.generateRefreshTokenExpiryDate();
        const refreshToken = this.generateRefreshToken(payload);

        return await this.refreshTokenService.createRefreshToken(
            user,
            refreshToken,
            refreshTokenExpiryDate,
        );
    }


    generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token required');
        }

        const refreshTokenEntity = await this.refreshTokenService.findRefreshToken(refreshToken);
        if (!refreshTokenEntity) {
            throw new ForbiddenException('Invalid refresh token');
        }

        if (refreshTokenEntity.expiryDate < new Date()) {
            await this.refreshTokenService.deleteRefreshToken(refreshTokenEntity);
            throw new ForbiddenException('Refresh token expired');
        }


        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = refreshTokenEntity.user;
            if (!user) {
                throw new UnauthorizedException('Invalid user associated with refresh token');
            }

            await this.refreshTokenService.deleteRefreshToken(refreshTokenEntity);

            const newPayload = { username: user.username, sub: user.id };
            const newAccessToken = this.generateAccessToken(newPayload);
            const newRefreshTokenEntity = await this.generateRefreshTokenAndSaveToDb(user, newPayload);

            return { accessToken: newAccessToken, refreshToken: newRefreshTokenEntity.token };
        } catch (error) {
            console.error("RefreshToken 검증 실패:", error);
            if (error instanceof ForbiddenException) {
                throw new UnauthorizedException('Invalid refresh token');
            } else {
                throw new UnauthorizedException('Invalid refresh token');
            }
        }
    }
}
