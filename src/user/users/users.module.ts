import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { FileUploadService } from '../../common/services/file-upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }
