import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostCategory } from '../enum/post-category.enum';

interface CreatePostParams extends CreatePostDto {
    authorId: number;
}

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
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
        const query = this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.category = :category', { category });

        if (search) {
            query.andWhere('(post.title LIKE :search OR post.content LIKE :search)', 
                { search: `%${search}%` });
        }

        const [posts, total] = await query
            .orderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            posts,
            total,
            page,
            lastPage: Math.ceil(total / limit)
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
        // TODO: 좋아요 기능 구현
        // 현재는 임시로 true 반환
        return { liked: true };
    }
}
