import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroup } from './entities/study-group.entity';
import { Category } from './entities/category.entity';
import { StudyGroupController } from './controller/study-group.controller';
import { StudyGroupService } from './service/study-group.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudyGroup, Category]),
    ],
    controllers: [StudyGroupController],
    providers: [StudyGroupService],
    exports: [StudyGroupService]
})
export class StudyModule { }
