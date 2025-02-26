import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // API prefix 설정
    app.setGlobalPrefix('/api');

    // 세션 미들웨어 설정
    const sessionSecret = configService.getOrThrow<string>('SESSION_SECRET');
    app.use(
        session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: configService.get<number>('SESSION_MAX_AGE'),
                httpOnly: true,
                secure: configService.get<string>('NODE_ENV') === 'production',
                sameSite: 'lax'
            },
            name: 'sessionId'
        }),
    );

    // passport 초기화
    app.use(passport.initialize());
    app.use(passport.session());

    // CORS 설정
    app.enableCors({
        origin: true,
        credentials: true,
    });

    // Validation 파이프 설정
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('Study API')
        .setDescription('Study API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
bootstrap();
