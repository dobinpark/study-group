// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../user/service/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      configService: ConfigService,
      private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log(`JwtStrategy - validate - 시작 - username: ${payload?.username}, sub: ${payload?.sub}`);
    const user = await this.usersService.findUserByUsername(payload.username);
    if (!user) {
      console.error(`JwtStrategy - validate - 사용자 Not Found - username: ${payload?.username}`);
      return null;
    }

    try {
      console.log(`JwtStrategy - validate - 사용자 검증 성공 - username: ${user?.username}, userId: ${user?.id}`);
      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      console.error(`JwtStrategy - validate - 에러 발생 - username: ${payload?.username}, error:`, error);
      throw error;
    } finally {
      console.log(`JwtStrategy - validate - 종료 - username: ${payload?.username}`);
    }
  }
}