import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { UserModule } from '../user/user.module';
import { PostsRepository } from './repository/posts.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, PostLike]),
        UserModule,
    ],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService]
})
export class PostsModule { }
