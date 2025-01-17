import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './user/auth/auth.module';
import { UsersModule } from './user/users/users.module';
import { StudyModule } from './study/study.module';
import { config } from 'dotenv';

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
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        StudyModule,
    ],
})
export class AppModule { }
