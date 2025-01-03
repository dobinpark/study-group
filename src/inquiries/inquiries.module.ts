import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { Inquiry } from './entities/inquiry.entity';
import { Attachment } from './entities/attachment.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileUploadService } from '../common/services/file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry, Attachment]),
    UsersModule,
    NotificationsModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService, FileUploadService],
})
export class InquiriesModule {}
