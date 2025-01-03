import { NestFactory } from '@nestjs/core';
import { promises as fs } from 'fs';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // uploads 디렉토리 생성 확인
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
  }

  // CORS 설정 추가
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://your-production-domain.com'
        : 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = Object.values(error.constraints || {});
          return constraints.length > 0
            ? constraints[0]
            : '유효하지 않은 값입니다.';
        });
        return new BadRequestException(messages);
      },
    }),
  );
  await app.listen(4000);
}
bootstrap();
