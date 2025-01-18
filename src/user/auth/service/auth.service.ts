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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RefreshTokenRepository)
        private refreshTokenRepository: RefreshTokenRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const user = await this.userRepository.createUser(authCredentialsDto);
        // 회원가입 후 자동 로그인 처리
        await this.createAndSaveRefreshToken(user);
        return user;
    }

    async logIn(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
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

        return { accessToken, refreshToken };
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

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const token = await this.refreshTokenRepository.findOne({
                where: { token: refreshToken },
                relations: ['user']
            });

            if (!token || token.expiresAt < new Date()) {
                throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
            }

            // User 테이블의 refresh_token과 비교
            if (!token.user.refreshTokens?.length) {
                throw new UnauthorizedException('리프레시 토큰이 존재하지 않습니다.');
            }

            const userRefreshToken = token.user.refreshTokens[0].token;
            if (userRefreshToken !== refreshToken) {
                throw new UnauthorizedException('리프레시 토큰이 일치하지 않습니다.');
            }

            const accessToken = this.jwtService.sign({ username: token.user.username });
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }
    }
}
