import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './user/auth/auth.module';
import { UsersModule } from './user/users/users.module';
import { StudyModule } from './study/study.module';
import { config } from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { PostsModule } from './posts/posts.module';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

config(); // .env 파일의 환경 변수를 로드합니다.

console.log(process.env.DB_HOST); // 환경 변수가 제대로 로드되었는지 확인

if (!process.env.DB_PORT) {
    throw new Error('DB_PORT 환경 변수가 정의되지 않았습니다.');
}

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        StudyModule,
        CacheModule.register<RedisClientOptions>({
            isGlobal: true,
            store: redisStore as any,
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            ttl: 300,
        }),
        PostsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
