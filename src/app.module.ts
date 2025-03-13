import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { StudyModule } from './study/study.module';
import { PostsModule } from './posts/posts.module';
import { validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SupportModule } from './support/support.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
                const dataSourceOptions: DataSourceOptions = {
                    type: 'mysql',
                    host: configService.get<string>('DB_HOST'),
                    port: configService.get<number>('DB_PORT'),
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_DATABASE'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                };

                console.log('TypeORM 설정 값:', dataSourceOptions);

                const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);

                try {
                    await dataSource.initialize();
                    console.log('🎉🎉🎉 데이터베이스 연결 성공! 🎉🎉🎉'); // 연결 성공 로그
                } catch (error) {
                    console.error('🔥🔥🔥 데이터베이스 연결 실패! 🔥🔥🔥', error); // 연결 실패 로그
                }

                return dataSourceOptions as TypeOrmModuleOptions;
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        UserModule,
        forwardRef(() => StudyModule),
        forwardRef(() => AuthModule),
        CacheModule.register<any>({
            isGlobal: true,
            ttl: 300,
        }),
        PostsModule,
        SupportModule,
        HttpModule,
    ],
    controllers: [],
    providers: [
    ],
})
export class AppModule {
    constructor() {
        console.log('AppModule이 로딩되었습니다.');
    }
}
