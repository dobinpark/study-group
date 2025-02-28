import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostCategory } from '../enum/post-category.enum';
import { PostsRepository } from '../repository/posts.repository';
import { PostLike } from '../entities/post-like.entity';

interface CreatePostParams extends CreatePostDto {
    authorId: number;
}

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostLike)
        private readonly postLikeRepository: Repository<PostLike>,
        private readonly postsRepository: PostsRepository
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
            likes: 0
        });

        return await this.postRepository.save(post);
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

        return post;
    }

    // 게시물 수정
    async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
        const post = await this.findOne(id);

        if (post.authorId !== userId) {
            throw new ForbiddenException('게시물을 수정할 권한이 없습니다.');
        }

        await this.postRepository.update(id, updatePostDto);
        return await this.findOne(id);
    }

    async deletePost(id: number, userId: number): Promise<void> {
        const post = await this.findOne(id);

        if (post.authorId !== userId) {
            throw new ForbiddenException('게시물을 삭제할 권한이 없습니다.');
        }

        await this.postRepository.delete(id);
    }

    // 좋아요 기능
    async toggleLike(postId: number, userId: number): Promise<{ liked: boolean }> {
        const post = await this.findOne(postId);
        
        // 데이터베이스에서 좋아요 관계 확인
        const likeRecord = await this.postLikeRepository.findOne({
            where: { postId, userId }
        });
        
        if (likeRecord) {
            // 좋아요 수 감소
            await this.postLikeRepository.remove(likeRecord);
            await this.postsRepository.decrementLike(postId);
            
            return { liked: false };
        } else {
            // 좋아요 수 증가
            const newLike = this.postLikeRepository.create({
                postId,
                userId
            });
            await this.postLikeRepository.save(newLike);
            await this.postsRepository.incrementLike(postId);
            
            return { liked: true };
        }
    }
}
