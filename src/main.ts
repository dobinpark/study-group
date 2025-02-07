import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/error.filter';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { dataSource } from './data-source';
import { Session } from './user/entities/session.entity'; // 세션 엔티티 임포트

async function bootstrap() {
    await dataSource.initialize(); // 데이터 소스 초기화

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 세션 스토어 설정 (TypeORM 사용)
    const sessionRepository = dataSource.getRepository(Session); // Session 엔티티 사용
    const sessionStore = new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 86400, // 세션 만료 시간 (24시간)
    }).connect(sessionRepository);

    // 세션 미들웨어 설정
    app.use(
        session({
            secret: configService.get<string>('SESSION_SECRET_KEY') || 'default_secret_key', // 기본값 제공
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Production 환경에서만 secure: true
                maxAge: 86400000, // 쿠키 만료 시간 (24시간)
                sameSite: 'lax', // CSRF 방어를 위한 SameSite 설정 (lax 권장)
            },
        }),
    );

    // 보안 헤더 설정 (CSP 강화)
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 'unsafe-eval' 제거 검토, 필요 시 추가
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https://*"], // 필요에 따라 이미지 소스 제한 (https:* 추가)
                fontSrc: ["'self'", "data:"], // 폰트 소스 설정
                objectSrc: ["'none'"], // 객체 소스 제한
                frameSrc: ["'none'"], // frame 소스 제한
                connectSrc: ["'self'"], // API 호출 경로만 허용하도록 수정 (필요에 따라 와일드카드 또는 특정 도메인 추가)
            },
        },
        hsts: { // HSTS 설정 추가 (HTTPS 강제화)
            maxAge: 31536000, // 1년
            includeSubDomains: true,
            preload: false, // 필요에 따라 preload 활성화
        },
        frameguard: {         // frameguard 설정 추가 (Clickjacking 방어)
            action: 'deny',     // 'deny', 'sameorigin', 'allow-from' 옵션 사용 가능
        },
        xContentTypeOptions: true,
        referrerPolicy: {       // referrer-policy 설정 추가 (Referer 헤더 제어)
            policy: "no-referrer-when-downgrade", // 또는 "strict-origin-when-cross-origin" 등
        },
        crossOriginEmbedderPolicy: false, // 필요에 따라 Cross-Origin-Embedder-Policy 설정
        crossOriginOpenerPolicy: false,  // 필요에 따라 Cross-Origin-Opener-Policy 설정
        crossOriginResourcePolicy: false, // 필요에 따라 Cross-Origin-Resource-Policy 설정
    }));

    // CORS 설정 (환경 변수 사용, origin 함수 개선)
    const allowedOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS')?.split(',') || ['http://localhost:8080'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) { // origin이 없거나 허용된 origin 인 경우
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // 쿠키 허용
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });

    // 전역 파이프 설정 (유효성 검사)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // API 경로 프리픽스 설정
    app.setGlobalPrefix('api');

    // Swagger 설정 (세션 인증 명시)
    const config = new DocumentBuilder()
        .setTitle('Study Group API')
        .setDescription('스터디 그룹 관리 API 문서 (세션 기반 인증)') // 세션 기반 인증 명시
        .setVersion('1.0')
        .addCookieAuth('connect.sid') // 쿠키 인증 방식 명시 (Swagger UI 에서 쿠키 입력 필드 활성화)
        .addTag('인증', '사용자 인증 관련 API (세션 기반)') // 세션 기반 인증 명시
        .addTag('게시판', '커뮤니티 게시판 API')
        .addTag('스터디 그룹', '스터디 그룹 관련 API')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            credentials: true, // Swagger UI 에서 쿠키 입력 활성화 (필요한 경우)
        },
    });

    // 전역 예외 필터 등록
    app.useGlobalFilters(new HttpExceptionFilter());

    // 포트 설정 (환경 변수 사용)
    const PORT = configService.get<number>('PORT') || 3000;
    await app.listen(PORT);
}
bootstrap();
