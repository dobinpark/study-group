import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { PostsRepository } from './repository/posts.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        CacheModule.register({
            ttl: 60 * 5, // 5분
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService]
})
export class PostsModule { }
