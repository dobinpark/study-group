/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponse } from './dto/post-response.dto';
import { SuccessResponse } from './interfaces/responses.interface';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Like } from 'typeorm';
import { Cache } from 'cache-manager';
import { CustomCacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CACHE_KEYS } from './cache/constants/cache-keys.constants';

@Injectable()
@UseInterceptors(CustomCacheInterceptor)
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // 1. 조회 메서드들
  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PostResponse>> {
    try {
      const [posts, total] = await this.postsRepository.findAndCount({
        relations: ['author', 'comments', 'likes'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        items: posts.map((post) => this.transformPost(post)),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (_) {
      throw new InternalServerErrorException(
        '게시물 목록을 조회하는 중 오류가 발생했습니다.',
      );
    }
  }

  async findOne(id: string): Promise<PostResponse> {
    try {
      const post = await this.findPost(id);
      return this.transformPost(post);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        '게시물을 조회하는 중 오류가 발생했습니다.',
      );
    }
  }

  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PostResponse>> {
    try {
      const sanitizedQuery = query.trim().toLowerCase();
      if (!sanitizedQuery) {
        return {
          items: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      const [posts, total] = await this.postsRepository.findAndCount({
        where: [
          { title: Like(`%${sanitizedQuery}%`) },
          { content: Like(`%${sanitizedQuery}%`) },
        ],
        relations: ['author', 'comments', 'likes'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        items: posts.map((post) => this.transformPost(post)),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '게시물 검색 중 오류가 발생했습니다.',
      );
    }
  }

  private async findPost(id: string): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id },
        relations: ['author', 'comments', 'likes'],
      });
      if (!post) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        '게시물을 조회하는 중 오류가 발생했습니다.',
      );
    }
  }

  // 2. 수정 메서드들
  async create(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<PostResponse> {
    try {
      const post = this.postsRepository.create({
        ...createPostDto,
        author: user,
      });
      const savedPost = await this.postsRepository.save(post);
      await this.clearListCache();
      return this.transformPost(savedPost);
    } catch (error) {
      throw new InternalServerErrorException(
        '게시물을 생성하는 중 오류가 발생했습니다.',
      );
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<PostResponse> {
    try {
      const post = await this.findPost(id);
      if (post.author.id !== user.id) {
        throw new UnauthorizedException('게시물을 수정할 권한이 없습니다.');
      }

      Object.assign(post, updatePostDto);
      const updatedPost = await this.postsRepository.save(post);
      await this.clearPostCache(id);
      return this.transformPost(updatedPost);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException(
        '게시물을 수정하는 중 오류가 발생했습니다.',
      );
    }
  }

  async remove(id: string, user: User): Promise<SuccessResponse> {
    try {
      const post = await this.findPost(id);
      if (post.author.id !== user.id) {
        throw new UnauthorizedException('게시물을 삭제할 권한이 없습니다.');
      }

      await this.postsRepository.remove(post);
      await this.clearPostCache(id);
      return { success: true };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException(
        '게시물을 삭제하는 중 오류가 발생했습니다.',
      );
    }
  }

  // 3. 유틸리티 메서드들
  private async clearPostCache(id: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(CACHE_KEYS.POSTS_LIST),
      this.cacheManager.del(CACHE_KEYS.getPostDetail(id)),
      this.cacheManager.del(CACHE_KEYS.POSTS_SEARCH),
    ]);
  }

  private transformPost(post: Post): PostResponse {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.username,
        avatarUrl: post.author.avatarUrl,
      },
      commentsCount: post.comments?.length || 0,
      likesCount: post.likes?.length || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private async clearListCache(): Promise<void> {
    await Promise.all([
      this.cacheManager.del(CACHE_KEYS.POSTS_LIST),
      this.cacheManager.del(CACHE_KEYS.POSTS_SEARCH),
    ]);
  }
}
