import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostCategory } from '../enum/post-category.enum';
import { PostsRepository } from '../repository/posts.repository';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface CreatePostParams extends CreatePostDto {
    authorId: number;
}

@Injectable()
export class PostsService {
    private readonly logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly postsRepository: PostsRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    // 게시물 생성
    async createPost(params: CreatePostParams): Promise<Post> {
        const { title, content, category, authorId } = params;

        if (!authorId) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        const post = this.postRepository.create({
            title,
            content,
            category,
            authorId,
            views: 0,
        });

        const savedPost = await this.postRepository.save(post);
        
        // 게시판 캐시 무효화
        await this.invalidateListCache();
        
        return savedPost;
    }

    // 카테고리별 게시물 조회
    async findByCategory(
        category: PostCategory,
        page: number = 1,
        limit: number = 10,
        search?: string
    ) {
        console.log('Searching posts with category:', category);
        
        // 숫자 타입 보장
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        
        // 카테고리별 총 게시글 수 먼저 조회
        const totalQuery = this.postRepository.createQueryBuilder('post')
            .where('post.category = :category', { category });
        
        if (search) {
            totalQuery.andWhere(
                '(post.title LIKE :search OR post.content LIKE :search)',
                { search: `%${search}%` }
            );
        }
        
        const total = await totalQuery.getCount();
        
        const queryBuilder = this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.category = :category', { category })
            .orderBy('post.createdAt', 'DESC');

        if (search) {
            queryBuilder.andWhere(
                '(post.title LIKE :search OR post.content LIKE :search)',
                { search: `%${search}%` }
            );
        }

        const skip = (pageNum - 1) * limitNum;
        console.log('Skip value:', skip, 'Type:', typeof skip);

        const items = await queryBuilder
            .skip(skip)
            .take(limitNum)
            .getMany();

        // 카테고리 내에서의 번호 계산하여 아이템에 추가
        const startNumber = total - skip;
        const processedItems = items.map((item, index) => {
            return {
                ...item,
                displayNumber: startNumber - index
            };
        });

        console.log('Found posts:', items.length, 'Total:', total);

        return {
            items: processedItems,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        };
    }

    // 게시물 상세 조회
    async findOne(id: number): Promise<Post> {
        const cacheKey = `post_${id}`;
        
        // 캐시에서 데이터 조회 시도
        const cachedPost = await this.cacheManager.get<Post>(cacheKey);
        if (cachedPost) {
            this.logger.debug(`캐시에서 게시글 반환: ${id}`);
            return cachedPost;
        }
        
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시물을 찾을 수 없습니다.');
        }

        // 조회수 증가
        await this.postRepository.increment({ id }, 'views', 1);
        post.views += 1;

        // 결과 캐싱
        await this.cacheManager.set(cacheKey, post, 300); // 5분 캐싱

        return post;
    }

    // 게시물 수정
    async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
        const post = await this.findOne(id);

        if (post.authorId !== userId) {
            throw new ForbiddenException('게시물을 수정할 권한이 없습니다.');
        }

        Object.assign(post, updatePostDto);
        const updatedPost = await this.postRepository.save(post);
        
        // 캐시 무효화
        await this.invalidateCache(id);
        
        return updatedPost;
    }

    async deletePost(id: number, userId: number): Promise<void> {
        const post = await this.findOne(id);

        if (post.authorId !== userId) {
            throw new ForbiddenException('게시물을 삭제할 권한이 없습니다.');
        }

        await this.postRepository.delete(id);
        
        // 캐시 무효화
        await this.invalidateCache(id);
        await this.invalidateListCache();
    }

    // 특정 게시글 캐시 무효화
    private async invalidateCache(id: number): Promise<void> {
        const cacheKey = `post_${id}`;
        await this.cacheManager.del(cacheKey);
        this.logger.debug(`게시글 캐시 무효화: ${id}`);
    }

    // 게시글 목록 캐시 무효화
    private async invalidateListCache(): Promise<void> {
        // 캐시 키 패턴은 지원되지 않으므로, 주요 목록만 무효화
        const categories = ['all', 'FREE', 'QUESTION', 'SUGGESTION'];
        
        for (const category of categories) {
            await this.cacheManager.del(`posts_list_${category}_1_10`);
        }
        
        this.logger.debug('게시글 목록 캐시 무효화 완료');
    }
}
