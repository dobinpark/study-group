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
    app.use(helmet());

    // CORS 설정
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    // 전역 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const options = new DocumentBuilder()
        .setTitle('API 문서 제목')
        .setDescription('API 문서 설명')
        .setVersion('1.0')
        .addTag('태그 이름')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document); // '/api' 경로에서 Swagger UI에 접근 가능

    await app.listen(3000);
}
bootstrap();
