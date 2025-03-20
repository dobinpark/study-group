import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { StudyGroup } from '../study/entities/study-group.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User, StudyGroup])
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService]
})
export class MessagesModule { }
