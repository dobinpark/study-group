import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../users/repository/user.repository';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RefreshTokenRepository)
        private refreshTokenRepository: RefreshTokenRepository,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const user = await this.userRepository.createUser(authCredentialsDto);
        // 회원가입 후 자동 로그인 처리
        await this.createAndSaveRefreshToken(user);
        return user;
    }

    async logIn(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; userId: number; nickname: string }> {
        const { username, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        const payload = { username };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = await this.createAndSaveRefreshToken(user);

        return { 
            accessToken, 
            refreshToken,
            userId: user.id,
            nickname: user.nickname
        };
    }

    private async createAndSaveRefreshToken(user: User): Promise<string> {
        const refreshToken = new RefreshToken();
        refreshToken.user = user;
        refreshToken.token = this.jwtService.sign(
            { username: user.username },
            { expiresIn: '7d' }
        );
        refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후

        // RefreshToken 테이블에 저장
        await this.refreshTokenRepository.save(refreshToken);

        // User 테이블의 refresh_token 업데이트
        user.refreshTokens = [{
            token: refreshToken.token,
            expiresAt: refreshToken.expiresAt
        }];
        await this.userRepository.save(user);

        return refreshToken.token;
    }

    async refreshAccessToken(refreshToken: string): Promise<string> {
        const tokenKey = `refresh_token:${refreshToken}`;
        const cachedToken = await this.cacheManager.get(tokenKey);

        if (!cachedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newAccessToken = this.jwtService.sign({ /* payload */ });
        return newAccessToken;
    }

    async logout(user: User): Promise<void> {
        const tokenKey = `user:${user.id}:token`;
        // 로그아웃 시 토큰을 블랙리스트에 추가
        await this.cacheManager.set(tokenKey, 'blacklisted', 86400000); // 24시간 유지
    }
}
