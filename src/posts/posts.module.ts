import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { getCacheConfig } from './cache/config/cache.config';

const cacheConfig = getCacheConfig();

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CacheModule.register(cacheConfig),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [TypeOrmModule],
})
export class PostsModule {}
