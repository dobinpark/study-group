import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/error.filter';

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
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:8080', // 로컬 개발 환경
                'http://3.34.184.97' // 프로덕션 환경
            ];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    });

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // 경로 프리픽스 설정
    app.setGlobalPrefix('api');

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

    // 전역 필터 등록
    app.useGlobalFilters(new HttpExceptionFilter());

    // 환경 변수 기반 설정 강화
    const PORT = configService.get<number>('PORT') || 3000;
    await app.listen(PORT);
}
bootstrap();
