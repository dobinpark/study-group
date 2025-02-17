import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) { }

    async createRefreshToken(user: User, token: string, expiryDate: Date): Promise<RefreshToken> {
        const refreshToken = this.refreshTokenRepository.create({
            token,
            expiryDate,
            user,
        });
        return await this.refreshTokenRepository.save(refreshToken);
    }

    async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return await this.refreshTokenRepository.findOne({
            where: { token },
            relations: ['user'],
        });
    }

    async deleteRefreshToken(refreshToken: RefreshToken): Promise<void> {
        await this.refreshTokenRepository.remove(refreshToken);
    }

    async deleteRefreshTokenForUser(user: User): Promise<void> {
        await this.refreshTokenRepository.delete({ user: { id: user.id } });
    }

    async generateRefreshTokenExpiryDate(): Promise<Date> {
        const expiryTime = new Date();
        expiryTime.setDate(expiryTime.getDate() + 7);
        return expiryTime;
    }
}
