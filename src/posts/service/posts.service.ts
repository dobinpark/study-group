import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { User } from '../../user/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsRepository)
        private postsRepository: PostsRepository,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findByCategory(category: PostCategory, page: number, limit: number, search?: string) {
        console.log('Service finding posts for category:', category);
        return await this.postsRepository.findByCategory(category, page, limit, search);
    }

    async createPost(createPostDto: CreatePostDto) {
        const { title, content, category, authorId } = createPostDto;

        // authorId가 없는 경우 에러 처리
        if (!authorId) {
            throw new UnauthorizedException('Author ID is required');
        }

        const post = this.postRepository.save({
            title,
            content,
            category,
            authorId,
            views: 0,
            likes: 0
        });

        return await this.postRepository.save(post);
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author'],  // author 정보도 함께 가져오기
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // 조회수 증가
        post.views += 1;
        await this.postRepository.save(post);

        return post;
    }

    async toggleLike(postId: number, userId: number): Promise<{ liked: boolean }> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['likedBy']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        const userLiked = post.likedBy.some(user => user.id === userId);

        if (userLiked) {
            post.likedBy = post.likedBy.filter(user => user.id !== userId);
            post.likes -= 1;
        } else {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }
            post.likedBy.push(user);
            post.likes += 1;
        }

        await this.postRepository.save(post);
        return { liked: !userLiked };
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // **생성자 기반 권한 검사**: 게시글 작성자의 username, email 과 현재 사용자 정보 비교
        if (post.author.username !== user.username || post.author.email !== user.email) {
            throw new UnauthorizedException('게시글을 수정할 권한이 없습니다.');
        }

        // Object.assign을 사용하여 업데이트
        Object.assign(post, updatePostDto);

        return await this.postsRepository.save(post);
    }

    async deletePost(id: number, user: User): Promise<void> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // **생성자 기반 권한 검사**: 게시글 작성자의 username, email 과 현재 사용자 정보 비교
        if (post.author.username !== user.username || post.author.email !== user.email) {
            throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
        }

        try {
            await this.postsRepository.remove(post);
        } catch (error) {
            throw new InternalServerErrorException('게시글 삭제 중 오류가 발생했습니다.');
        }
    }
}
