import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroupController } from './study-group.controller';
import { StudyGroupService } from './study-group.service';
import { StudyGroup } from './entities/study-group.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Category } from './entities/category.entity';
import { StudyGroupJoinRequest } from './entities/study-group-join-request.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            StudyGroup,
            Category,
            StudyGroupJoinRequest
        ]),
        UserModule,
        AuthModule,
    ],
    controllers: [StudyGroupController],
    providers: [
        StudyGroupService,
        {
            provide: Logger,
            useFactory: () => new Logger('StudyModule'),
        }
    ],
    exports: [StudyGroupService]
})
export class StudyModule { }
