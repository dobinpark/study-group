import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import * as session from 'express-session';
import * as passport from 'passport';
import { DataSource } from 'typeorm';

declare const module: any; // HMR 타입 선언 추가

async function bootstrap() {
    // NestFactory.create 대신 createDevServer 사용
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create(AppModule, { cors: true });
    const configService = app.get(ConfigService);
    const dataSource = app.get(DataSource);
    const logger = new Logger('Main');

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));

    // 전역 인터셉터 설정
    app.useGlobalInterceptors(new LoggingInterceptor());

    // API 경로 접두사
    app.setGlobalPrefix('api');

    // 메모리 기반 세션 설정
    setupSession(app, configService);

    // CORS 설정
    setupCors(app);

    // Swagger 설정
    setupSwagger(app);

    // 애플리케이션 종료 처리
    app.enableShutdownHooks();

    // 디버그 모드 설정
    if (process.env.NODE_ENV !== 'production') {
        logger.log('디버그 모드로 실행 중입니다.');
        process.env.DEBUG = 'express:*,passport:*,connect:*';
    }

    // 서버 시작
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);

    // HMR 활성화 (개발 모드인 경우)
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    logger.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}

function setupSession(app: INestApplication, configService: ConfigService) {
    app.use(
        session({
            secret: configService.get<string>('SESSION_SECRET', 'your-secret-key'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
}

function setupCors(app: INestApplication) {
    app.enableCors({
        origin: ['http://localhost:8080'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
    });
}

function setupSwagger(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('스터디 그룹 API')
        .setDescription('스터디 그룹 애플리케이션 API 문서')
        .setVersion('1.0')
        .addTag('인증', '인증 관련 API')
        .addTag('사용자', '사용자 관련 API')
        .addTag('스터디', '스터디 그룹 관련 API')
        .addTag('게시판', '게시판 관련 API')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey
    });

    SwaggerModule.setup('swagger', app, document, {
        useGlobalPrefix: false,
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'none'
        }
    });
}

bootstrap();
