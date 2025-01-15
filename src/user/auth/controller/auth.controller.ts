import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.logIn(loginDto);
    }

    @Post('/refresh')
    refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
        return this.authService.refreshAccessToken(refreshToken);
    }
}
