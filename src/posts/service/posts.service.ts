import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>
    ) {}

    async findByCategory(category: string, options: { page: number; limit: number; search?: string }) {
        const query = this.postsRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.category = :category', { category });

        if (options.search) {
            query.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
                search: `%${options.search}%`
            });
        }

        const [items, total] = await query
            .orderBy('post.createdAt', 'DESC')
            .skip((options.page - 1) * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return {
            items,
            total
        };
    }
} 