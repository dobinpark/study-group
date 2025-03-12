import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroupController } from './study-group.controller';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './entities/study-group.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Category } from './entities/category.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([StudyGroup, Category]),
        UserModule,
        AuthModule,
    ],
    controllers: [StudyGroupController],
    providers: [StudyGroupService, Logger],
    exports: [StudyGroupService]
})
export class StudyModule {}
