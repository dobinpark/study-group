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
            load: [() => {
                console.log('ConfigModule이 환경 변수 로딩 시작!');
                return {};
            }]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
                const nodeEnv = configService.get<string>('NODE_ENV');
                console.log('현재 NODE_ENV:', nodeEnv); // 환경 확인용 로그 추가

                const isDevelopment = nodeEnv !== 'production'; // 명확하게 production이 아닐 때만 development로 처리
                console.log('isDevelopment:', isDevelopment); // 설정 확인용 로그 추가

                const dataSourceOptions: DataSourceOptions = {
                    type: 'mysql',
                    host: configService.get<string>('DB_HOST'),
                    port: configService.get<number>('DB_PORT'),
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_DATABASE'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: isDevelopment, // development 환경에서는 true가 되어야 함
                    logging: true,
                    connectTimeout: 30000
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
    providers: [],
})
export class AppModule {
    constructor() {
        console.log('🔥🔥🔥 AppModule 생성자 실행됨! 🔥🔥🔥');
    }
}
