import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any; // HMR 타입 선언 추가

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService = app.get(ConfigService);

    const logger = new Logger('Main');

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
            console.error('Validation failed:');
            errors.forEach(error => {
                console.error(`  Property: ${error.property}`);
                console.error(`  Value: ${error.value}`);
                console.error(`  Constraints: ${JSON.stringify(error.constraints)}`);
            });
            return new BadRequestException(errors);
        },
    }));

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
    // if (process.env.NODE_ENV !== 'production') { // Production 환경에서는 제거 또는 로깅 레벨 조정
    //     logger.log('디버그 모드로 실행 중입니다.');
    //     process.env.DEBUG = 'express:*,passport:*,connect:*';
    // }

    // 서버 시작
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
    console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);

    // HMR 활성화 (개발 모드인 경우)
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

function setupSession(app: INestApplication, configService: ConfigService) {
    app.use(
        session({
            secret: configService.get<string>('SESSION_SECRET') || 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
}

function setupCors(app: INestApplication) {
    const corsOptions = {
        origin: process.env.NODE_ENV !== 'production'
            ? 'http://localhost:8080' // 개발 환경에서는 8080 포트 허용
            : 'http://3.34.184.97',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    };
    app.enableCors(corsOptions);
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
        .addTag('고객센터', '고객센터 관련 API')
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
