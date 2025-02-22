import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthSignupDto } from '../dto/auth.signUp.dto';
import { AuthFindPasswordDto } from '../dto/auth.findPassword.dto';
import { AuthLoginResponseDto } from '../dto/auth.loginResponse.dto';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
    private static readonly SALT_ROUNDS = 10;
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async loginWithCredentials(username: string, password: string): Promise<AuthLoginResponseDto> {
        this.logger.debug(`Validating user: ${username}`);
        try {
            const user = await this.authRepository.findByUsername(username);
            if (!user) {
                this.logger.debug(`User ${username} not found`);
                throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
            }

            const { password: _, ...result } = user;
            return result as AuthLoginResponseDto;
        } catch (error) {
            this.logger.error(`Login failed for user ${username}`, error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('로그인 처리 중 오류가 발생했습니다.');
        }
    }

    async signUp(signupDto: AuthSignupDto): Promise<{ success: boolean; message: string }> {
        const { username, email, password, confirmPassword } = signupDto;

        // 비밀번호 확인
        if (password !== confirmPassword) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }

        try {
            // 사용자 중복 검사
            const [existingUsername, existingEmail] = await Promise.all([
                this.authRepository.findByUsername(username),
                this.authRepository.findByEmail(email)
            ]);

            if (existingUsername) {
                throw new BadRequestException('이미 존재하는 아이디입니다.');
            }

            if (existingEmail) {
                throw new BadRequestException('이미 사용 중인 이메일입니다.');
            }

            // 비밀번호 해싱
            const hashedPassword = await bcrypt.hash(password, AuthService.SALT_ROUNDS);

            // 사용자 생성
            const { confirmPassword: _, ...signupData } = signupDto;
            await this.authRepository.createUser({
                ...signupData,
                password: hashedPassword,
            });

            return {
                success: true,
                message: '회원가입이 완료되었습니다.'
            };
        } catch (error) {
            this.logger.error(`Error signing up user ${username}`, error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.');
        }
    }

    async findPassword(findPasswordDto: AuthFindPasswordDto): Promise<{ tempPassword: string }> {
        const { username, email } = findPasswordDto;

        try {
            const user = await this.authRepository.findByUsername(username);
            if (!user || user.email !== email) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const tempPassword = uuidv4().slice(0, 12);
            const hashedPassword = await bcrypt.hash(tempPassword, AuthService.SALT_ROUNDS);

            await this.authRepository.updatePassword(user.id, hashedPassword);

            // TODO: 이메일 발송 로직 추가
            this.logger.log(`임시 비밀번호 '${tempPassword}'가 사용자 '${username}'에게 발급되었습니다.`);
            return { tempPassword };
        } catch (error) {
            this.logger.error(`Password reset failed for user ${username}`, error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('비밀번호 찾기 처리 중 오류가 발생했습니다.');
        }
    }
}
