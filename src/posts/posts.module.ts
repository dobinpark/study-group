import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User]),
        CacheModule.register()
    ],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService]
})
export class PostsModule { }
