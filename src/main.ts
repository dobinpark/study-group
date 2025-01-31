import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 보안 헤더 설정
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"]
            }
        }
    }));

    // CORS 설정 개선
    app.enableCors({
        origin: process.env.NODE_ENV === 'production' 
            ? 'http://3.34.184.97'
            : 'http://localhost:8080',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const options = new DocumentBuilder()
        .setTitle('Study Group API')
        .setDescription('스터디 그룹 관리 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('인증', '사용자 인증 관련 API')
        .addTag('게시판', '커뮤니티 게시판 API')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document); // '/api' 경로에서 Swagger UI에 접근 가능

    // 환경 변수 기반 설정 강화
    const PORT = configService.get<number>('PORT') || 3000;
    await app.listen(PORT);
}
bootstrap();
