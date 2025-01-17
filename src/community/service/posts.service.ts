import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
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
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // 조회수 증가
        post.views += 1;
        await this.postsRepository.save(post);

        return post;
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