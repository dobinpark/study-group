import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './user/auth/auth.module';
import { UsersModule } from './user/users/users.module';
import { StudyModule } from './study/study.module';
import { config } from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { PostsModule } from './posts/posts.module';

config(); // .env 파일의 환경 변수를 로드합니다.

console.log(process.env.DB_HOST); // 환경 변수가 제대로 로드되었는지 확인

if (!process.env.DB_PORT) {
    throw new Error('DB_PORT 환경 변수가 정의되지 않았습니다.');
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true, // 개발 환경에서만 true로 설정
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        StudyModule,
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: String(process.env.REDIS_HOST || 'localhost'),
            port: parseInt(String(process.env.REDIS_PORT || '6379')),
            ttl: 300, // 기본 캐시 유효시간 5분
        }),
        PostsModule,
    ],
})
export class AppModule { }
