import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroupController } from './study-group.controller';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './entities/study-group.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudyGroup]),
        UserModule,
        AuthModule,
    ],
    controllers: [StudyGroupController],
    providers: [StudyGroupService],
    exports: [StudyGroupService]
})
export class StudyModule {}
