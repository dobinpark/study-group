import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 보안 헤더 설정 (CSP 강화)
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https://*"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                connectSrc: ["'self'"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: false,
        },
        frameguard: {
            action: 'deny',
        },
        xContentTypeOptions: true,
        referrerPolicy: {
            policy: "no-referrer-when-downgrade",
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
    }));

    // CORS 설정
    const allowedOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS')
        ?.split(',')
        .map(origin => origin.trim()) || ['http://localhost:8080'];

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // API 경로 프리픽스 설정
    app.setGlobalPrefix('api');

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('Study Group API')
        .setDescription('스터디 그룹 관리 API 문서 (JWT 기반 인증)')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('인증', '사용자 인증 관련 API (JWT 기반)')
        .addTag('게시판', '커뮤니티 게시판 API')
        .addTag('스터디 그룹', '스터디 그룹 관련 API')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // 포트 설정
    const PORT = configService.get<number>('PORT') || 3000;
    await app.listen(PORT);
}
bootstrap();
