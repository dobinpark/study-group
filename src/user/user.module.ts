import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule,
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UserModule { }
