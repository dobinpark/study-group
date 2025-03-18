import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createClient } from 'redis';
import * as connectRedis from 'connect-redis';

declare const module: any; // HMR 타입 선언 추가

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Main');
    const isProduction = process.env.NODE_ENV === 'production';

    let redisClient;
    if (isProduction) {
        // Redis 클라이언트 생성 (운영 환경에서만)
        redisClient = createClient({
            url: `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', 6379)}`
        });

        try {
            await redisClient.connect().catch((err) => {
                console.error('Redis 연결 실패 세부 정보:', err);
                console.error('Redis 연결 실패 세부정보 JSON:', JSON.stringify(err));
                console.error('Redis 연결 설정:', { redisHost: configService.get('REDIS_HOST'), redisPort: configService.get('REDIS_PORT') });
                throw err;
            });
            logger.log('Redis 서버에 연결되었습니다.');
            
            redisClient.on('error', (err) => {
                logger.error('Redis 클라이언트 에러:', err);
            });
        } catch (err) {
            logger.error('Redis 연결 실패:', err);
            process.exit(1);
        }
    }

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

    // 세션 설정
    setupSession(app, configService, redisClient);

    // CORS 설정
    setupCors(app, configService);

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

function setupSession(app: INestApplication, configService: ConfigService, redisClient: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    const logger = new Logger('Session');

    const sessionConfig: session.SessionOptions = {
        secret: configService.get<string>('SESSION_SECRET') || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: configService.get<number>('SESSION_MAX_AGE', 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
        }
    };

    // 운영 환경에서만 Redis 세션 스토어 사용
    if (isProduction && redisClient) {
        try {
            // connect-redis v7.x 이상 사용 방식
            const RedisStore = connectRedis.default;
            sessionConfig.store = new RedisStore({ 
                client: redisClient,
                prefix: "session:" 
            });
            logger.log('Redis 세션 스토어를 사용합니다.');
        } catch (error) {
            logger.error('Redis 세션 스토어 초기화 실패:', error);
            logger.warn('메모리 세션 스토어로 대체합니다.');
        }
    } else {
        logger.log('메모리 세션 스토어를 사용합니다.');
    }

    app.use(session(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());
}

function setupCors(app: INestApplication, configService: ConfigService) {
    const corsOrigin = configService.get<string>('CORS_ORIGIN'); // 환경 변수에서 CORS origin 가져오기
    const corsOptions = {
        origin: process.env.NODE_ENV !== 'production'
            ? 'http://localhost:8080' // 개발 환경에서는 8080 포트 허용
            : corsOrigin, // Production 환경에서는 환경 변수 값 사용
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
