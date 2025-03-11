import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { Support } from './entities/support.entity';
import { UserModule } from '../user/user.module';
import { SupportRepository } from './repository/support.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Support]),
        CacheModule.register({
            ttl: 60 * 5,
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [SupportController],
    providers: [SupportService, SupportRepository],
    exports: [SupportService]
})
export class SupportModule {
    constructor() {
        console.log('SupportModule이 로딩되었습니다.');
    }
} 