import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import * as ConnectRedis from 'connect-redis';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });

    const configService = app.get(ConfigService);
    const isProduction = configService.get<string>('NODE_ENV') === 'production';

    // API 접두사 설정
    app.setGlobalPrefix('/api');

    // Redis 클라이언트 설정
    await setupRedis(app, configService, logger);

    // 세션 및 인증 설정
    setupAuthentication(app, configService);

    // CORS 설정
    setupCors(app, isProduction, configService);

    // 글로벌 파이프, 인터셉터, 필터 설정
    setupGlobalMiddleware(app);

    // Swagger 문서 설정
    if (!isProduction) {
        setupSwagger(app);
    }

    // 애플리케이션 종료 처리
    app.enableShutdownHooks();

    // 서버 시작
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
    logger.log(`애플리케이션이 http://localhost:${port} 에서 실행 중입니다`);
    logger.log(`환경: ${isProduction ? '운영' : '개발'}`);
}

// Redis 설정 함수
async function setupRedis(app: INestApplication, configService: ConfigService, logger: Logger) {
    const redisClient = createClient({
        url: `redis://${configService.get<string>('REDIS_HOST', 'localhost')}:${configService.get<number>('REDIS_PORT', 6379)}`,
    });

    try {
        await redisClient.connect();
        logger.log('Redis 연결 성공');
        
        // Redis 세션 스토어 설정
        const RedisStore = ConnectRedis(session);
        const sessionStore = new RedisStore({
            client: redisClient,
            prefix: 'session:',
            ttl: configService.get<number>('SESSION_MAX_AGE', 86400) / 1000,
        });
        
        // 세션 미들웨어 설정
        app.use(
            session({
                secret: configService.getOrThrow<string>('SESSION_SECRET'),
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: configService.get('NODE_ENV') === 'production',
                    maxAge: configService.get<number>('SESSION_MAX_AGE', 86400 * 1000),
                    sameSite: 'lax'
                },
                store: sessionStore,
                name: 'sessionId'
            }),
        );
        
        return redisClient;
    } catch (error) {
        const err = error as Error;
        logger.error(`Redis 연결 실패: ${err.message || '알 수 없는 오류'}`, err.stack || '스택 정보 없음');
        
        // Redis 연결 실패시 메모리 세션으로 대체
        logger.warn('메모리 기반 세션으로 대체합니다. 운영 환경에서는 권장되지 않습니다.');
        app.use(
            session({
                secret: configService.getOrThrow<string>('SESSION_SECRET'),
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: configService.get('NODE_ENV') === 'production',
                    maxAge: configService.get<number>('SESSION_MAX_AGE', 86400 * 1000),
                    sameSite: 'lax'
                },
                name: 'sessionId'
            }),
        );
        
        return null;
    }
}

// 인증 설정 함수
function setupAuthentication(app: INestApplication, configService: ConfigService) {
    // Passport 초기화
    app.use(passport.initialize());
    app.use(passport.session());
}

// CORS 설정 함수
function setupCors(app: INestApplication, isProduction: boolean, configService: ConfigService) {
    app.enableCors({
        origin: isProduction
            ? configService.get<string>('ALLOWED_ORIGINS', '').split(',')
            : ['http://localhost:8080'],
        credentials: true,
        allowedHeaders: [
            'Access-Control-Allow-Credentials',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
            'Pragma'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        exposedHeaders: ['Authorization']
    });
}

// 글로벌 미들웨어 설정 함수
function setupGlobalMiddleware(app: INestApplication) {
    // 검증 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    }));

    // 전역 인터셉터 설정
    app.useGlobalInterceptors(new LoggingInterceptor());

    // 전역 예외 필터 설정
    app.useGlobalFilters(new GlobalExceptionFilter());
}

// Swagger 설정 함수
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

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    
    // useGlobalPrefix: false 옵션을 사용하여 글로벌 접두사 적용 안 함
    SwaggerModule.setup('swagger', app, document, { useGlobalPrefix: false });
}

bootstrap().catch(error => {
    console.error('애플리케이션 시작 실패:', error);
    process.exit(1);
});
