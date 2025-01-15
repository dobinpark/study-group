import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';
import { Post } from './entities/post.entity';
import { PostRepository } from './repository/post.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostRepository])],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService, TypeOrmModule],
})
export class PostsModule { }
