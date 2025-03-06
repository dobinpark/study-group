import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private authService: AuthService) {
        super({ usernameField: 'username', passwordField: 'password' });
    }

    async validate(username: string, password?: string): Promise<any> {
        this.logger.debug(`LocalStrategy validate 호출 - username: ${username}`);
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            this.logger.warn(`LocalStrategy validate 실패 - username: ${username}`);
            throw new UnauthorizedException('Invalid credentials');
        }
        this.logger.debug(`LocalStrategy validate 성공 - username: ${username}, user: ${JSON.stringify(user)}`);
        return user;
    }
}
