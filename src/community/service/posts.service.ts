import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async createPost(createPostDto: CreatePostDto, author: User): Promise<Post> {
        const post = this.postsRepository.create({
            ...createPostDto,
            author
        });
        return await this.postsRepository.save(post);
    }

    async findAll(category?: PostCategory): Promise<Post[]> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .orderBy('post.createdAt', 'DESC');

        if (category) {
            queryBuilder.where('post.category = :category', { category });
        }

        return await queryBuilder.getMany();
    }

    async findOne(id: number): Promise<Post> {
        // 1. 게시글 데이터 캐시 확인
        const cacheKey = `post:${id}`;
        let post = await this.cacheManager.get<Post | null>(cacheKey) || null;

        if (!post) {
            post = await this.postsRepository.findOne({
                where: { id },
                relations: ['author']
            });

            if (!post) {
                throw new NotFoundException('게시글을 찾을 수 없습니다.');
            }

            // 캐시에 저장 (10분)
            await this.cacheManager.set(cacheKey, post, 600000);
        }

        // 2. 조회수는 Redis에서 별도로 관리
        const viewsKey = `post:${id}:views`;
        const views = await this.cacheManager.get<number>(viewsKey) || 0;
        await this.cacheManager.set(viewsKey, views + 1);

        // 3. 주기적으로 DB에 동기화 (별도의 스케줄러에서 처리)
        if (views % 10 === 0) { // 10회 조회마다 DB 업데이트
            await this.postsRepository.update(id, { views: views + 1 });
        }

        return { ...post, views: views + 1 };
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        if (post.author.id !== user.id) {
            throw new UnauthorizedException('게시글을 수정할 권한이 없습니다.');
        }

        Object.assign(post, updatePostDto);
        return await this.postsRepository.save(post);
    }

    async deletePost(id: number, user: User): Promise<void> {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        if (post.author.id !== user.id) {
            throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
        }

        await this.postsRepository.remove(post);
    }

    async likePost(id: number): Promise<Post> {
        const post = await this.postsRepository.findOne({ where: { id } });
        
        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        post.likes += 1;
        return await this.postsRepository.save(post);
    }
} 