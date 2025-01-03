import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { StudyGroup } from './entities/study-group.entity';
import { StudyGroupMembership } from './entities/study-group-membership.entity';
import { StudySchedule } from './entities/study-schedule.entity';
import { StudyGroupsService } from './study-groups.service';
import { StudyGroupsController } from './study-groups.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyGroup, StudyGroupMembership, StudySchedule]),
    NotificationsModule,
    CacheModule.register({
      ttl: 30,
      max: 100,
    }),
  ],
  controllers: [StudyGroupsController],
  providers: [StudyGroupsService],
})
export class StudyGroupsModule {}
