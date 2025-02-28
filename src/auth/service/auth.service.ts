import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthSignupDto } from '../dto/auth.signUp.dto';
import { AuthFindPasswordDto } from '../dto/auth.findPassword.dto';
import { AuthLoginResponseDto } from '../dto/auth.loginResponse.dto';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginDto } from '../dto/auth.login.dto';

@Injectable()
export class AuthService {
    private static readonly SALT_ROUNDS = 10;
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly authRepository: AuthRepository,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // 로그인 유효성 검사
    async loginWithCredentials(username: string, password: string): Promise<AuthLoginResponseDto> {
        this.logger.debug(`로그인 시도: ${username}`);
        try {
            const user = await this.authRepository.findByUsername(username);
            if (!user) {
                this.logger.debug(`사용자 없음: ${username}`);
                throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.debug(`비밀번호 불일치: ${username}`);
                throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
            }

            this.logger.log(`로그인 성공: ${username} (ID: ${user.id})`);
            const { password: _, ...result } = user;
            return result as AuthLoginResponseDto;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`로그인 처리 중 오류: ${username}`, error);
            throw new InternalServerErrorException('로그인 처리 중 오류가 발생했습니다.');
        }
    }

    // 회원가입
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
            await this.authRepository.createUser({
                ...signupDto,
                password: hashedPassword,
            });

            this.logger.log(`회원가입 성공: ${username}`);
            return { success: true, message: '회원가입이 완료되었습니다.' };
        } catch (error) {
            this.logger.error(`회원가입 실패: ${username}`, error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.');
        }
    }

    // 비밀번호 찾기
    async findPassword(findPasswordDto: AuthFindPasswordDto): Promise<{ tempPassword: string }> {
        const { username, email } = findPasswordDto;

        try {
            const user = await this.authRepository.findByUsername(username);
            if (!user || user.email !== email) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const tempPassword = this.generateSecurePassword();
            const hashedPassword = await bcrypt.hash(tempPassword, AuthService.SALT_ROUNDS);

            await this.authRepository.updatePassword(user.id, hashedPassword);

            // TODO: 이메일 발송 로직 추가
            this.logger.log(`임시 비밀번호 발급: ${username} (ID: ${user.id})`);
            return { tempPassword };
        } catch (error) {
            this.logger.error(`비밀번호 찾기 실패: ${username}`, error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('비밀번호 찾기 처리 중 오류가 발생했습니다.');
        }
    }

    // 사용자 검증
    async validateUser(loginDto: AuthLoginDto): Promise<User> {
        const { username, password } = loginDto;
        
        this.logger.debug(`사용자 검증: ${username}`);
        const user = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            this.logger.debug(`검증 실패 - 사용자 없음: ${username}`);
            throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            this.logger.debug(`검증 실패 - 비밀번호 불일치: ${username}`);
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        this.logger.debug(`사용자 검증 성공: ${username}`);
        return user;
    }

    // 로그아웃 처리
    async logout(session: any): Promise<void> {
        if (!session) {
            return;
        }
        
        const userId = session.user?.id;
        this.logger.debug(`로그아웃 시도: 사용자 ID ${userId}`);
        
        try {
            await new Promise<void>((resolve, reject) => {
                session.destroy((err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            this.logger.log(`로그아웃 성공: 사용자 ID ${userId}`);
        } catch (error) {
            this.logger.error(`로그아웃 실패: 사용자 ID ${userId}`, error);
            throw new InternalServerErrorException('로그아웃 처리 중 오류가 발생했습니다.');
        }
    }

    // 사용자 ID로 검색
    async findUserById(id: number): Promise<User | null> {
        this.logger.debug(`사용자 ID 검색: ${id}`);
        return this.usersRepository.findOne({ where: { id } });
    }
    
    // 안전한 임시 비밀번호 생성
    private generateSecurePassword(): string {
        const tempPassword = uuidv4().slice(0, 8) + 
                           Math.floor(Math.random() * 10) + 
                           String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
                           String.fromCharCode(Math.floor(Math.random() * 26) + 65) +
                           '!';
        return tempPassword;
    }
}
