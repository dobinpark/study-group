import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 새로운 사용자를 등록합니다.
   * @param signUpDto - 회원가입 정보
   * @returns 생성된 사용자 정보 (비밀번호 제외)
   */
  async signUp(signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    const { email, password: rawPassword, username } = signUpDto;

    // 이메일 중복 확인
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 새 사용자 생성
    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      isAdmin: false,
    });

    await this.usersRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 사용자 로그인을 처리합니다.
   * @param signInDto - 로그인 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const { email, password: inputPassword } = signInDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다');
    }

    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
  }
}
