import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthSignupDto } from './dto/auth.signUp.dto';
import { AuthFindPasswordDto } from './dto/auth.findPassword.dto';
import { AuthRepository } from './repository/auth.repository';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthMeResponseDto } from './dto/meResponse.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
    private static readonly SALT_ROUNDS = 10;
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly authRepository: AuthRepository,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private userService: UserService,
        private jwtService: JwtService,
    ) { }


    // 로그인 유효성 검사
    async loginWithCredentials(username: string, password: string): Promise<any> {
        this.logger.debug(`사용자 로그인 시도: ${username}`);
        const user = await this.validateUser(username, password);

        if (!user) {
            this.logger.warn(`${username} 로그인 실패: 잘못된 사용자 정보`);
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
        }

        this.logger.debug(`${username} 로그인 성공`);
        return user;
    }


    // 회원가입
    async signUp(signupDto: AuthSignupDto): Promise<{ success: boolean; message: string }> {
        const { username, email, password, confirmPassword, nickname, phoneNumber } = signupDto;

        // 비밀번호 확인
        if (password !== confirmPassword) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }

        try {
            // 사용자 중복 검사 (아이디, 이메일, 닉네임, 전화번호)
            const [existingUsername, existingEmail, existingNickname, existingPhoneNumber] = await Promise.all([
                this.authRepository.findByUsername(username),
                this.authRepository.findByEmail(email),
                this.authRepository.findByNickname(nickname),
                this.authRepository.findByPhoneNumber(phoneNumber)
            ]);

            if (existingUsername) {
                throw new BadRequestException('이미 존재하는 아이디입니다.');
            }

            if (existingEmail) {
                throw new BadRequestException('이미 사용 중인 이메일입니다.');
            }

            if (existingNickname) {
                throw new BadRequestException('이미 사용 중인 닉네임입니다.');
            }

            if (existingPhoneNumber) {
                throw new BadRequestException('이미 등록된 전화번호입니다.');
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

            // TODO: 이메일 발송 로직 추가 (추후 구현)
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
    async validateUser(username: string, password?: string): Promise<any> {
        this.logger.debug(`validateUser 호출 - username: ${username}`);
        const user = await this.userService.findByUsername(username);
        if (!user) {
            this.logger.warn(`validateUser 실패 - username: ${username}: 사용자 없음`);
            return null;
        }
        if (!password) {
            this.logger.debug(`validateUser 성공 (세션 기반) - username: ${username}, user: ${JSON.stringify(user)}`);
            return user;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`validateUser 실패 - username: ${username}: 비밀번호 불일치`);
            return null;
        }
        this.logger.debug(`validateUser 성공 - username: ${username}, user: ${JSON.stringify(user)}`);
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
    async findUserById(id: number): Promise<AuthMeResponseDto | null> {
        this.logger.debug(`사용자 ID 검색 시작: ${id}`);
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
                select: ['id', 'username', 'nickname', 'role']
            });
            if (!user) {
                this.logger.warn(`사용자 ID ${id}로 사용자 정보 찾을 수 없음`);
                return null;
            }
            const authMeResponseDto: AuthMeResponseDto = {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                role: user.role,
            };
            this.logger.debug(`사용자 ID 검색 완료: ${id}, 사용자 이름: ${user.username}`);
            return authMeResponseDto;
        } catch (error) {
            this.logger.error(`사용자 ID 검색 중 오류 발생: ${id}`, error);
            throw new InternalServerErrorException('사용자 정보 조회 중 오류가 발생했습니다.');
        }
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

    async validateSession(req: Request): Promise<any> {
<<<<<<< HEAD
        // ... (existing validateSession method - if you still have it)
=======
        this.logger.debug(`세션 유효성 검사 시작 (세션 ID: ${req.sessionID})`);
        if (!req.session || !req.session.user) {
            this.logger.warn('유효하지 않은 세션: 세션 또는 사용자 정보 없음');
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        // 세션 만료 시간 확인 (선택적) - 필요에 따라 AuthGuard에서만 체크하거나, AuthService에서 체크하도록 선택
        const now = Date.now();
        if (req.session.cookie.expires && new Date(req.session.cookie.expires).getTime() < now) {
            this.logger.warn('유효하지 않은 세션: 세션 만료');
            throw new UnauthorizedException('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        this.logger.debug(`세션 유효성 검사 통과 (세션 ID: ${req.sessionID}, 사용자 ID: ${req.session.user.id})`);
        return true; // 세션 유효
>>>>>>> origin/main
    }

    async deserializeUser(userId: number, done: (err: Error | null, user: any) => void): Promise<void> {
        this.logger.debug(`[deserializeUser] 사용자 역직렬화 시작: ${userId}`);
        try {
            const user = await this.findUserById(userId);
            if (!user) {
                this.logger.warn(`[deserializeUser] 사용자 ID ${userId}로 사용자 찾을 수 없음`);
                return done(null, false);
            }

            this.logger.debug(`[deserializeUser] 사용자 정보 조회 성공: ${JSON.stringify(user)}`);
            done(null, user); // user 객체를 done() 콜백으로 전달

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`[deserializeUser] 사용자 역직렬화 실패: ${errorMessage}`);
            // error가 Error 인스턴스인지 확인 후 done() 호출
            if (error instanceof Error) {
                done(error, false);
            } else {
                // Error 인스턴스가 아니면 새로운 Error 객체 생성하여 전달
                done(new Error('사용자 역직렬화 중 알 수 없는 오류 발생'), false);
            }
        }
    }
}
