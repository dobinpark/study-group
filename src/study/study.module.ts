import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroupController } from './controller/study-group.controller';
import { StudyGroupService } from './service/study-group.service';
import { StudyGroup } from './entities/study-group.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudyGroup]),
        UserModule,
    ],
    controllers: [StudyGroupController],
    providers: [StudyGroupService],
    exports: [StudyGroupService]
})
export class StudyModule {}
