import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostCategory } from '../enum/post-category.enum';

@Injectable()
export class PostsRepository extends Repository<Post> {
    constructor(private dataSource: DataSource) {
        super(Post, dataSource.createEntityManager());
    }

    // 카테고리별 게시물 찾기
    async findByCategory(category: PostCategory, page: number, limit: number, search?: string) {
        console.log('Repository finding posts for category:', category);
        
        const queryBuilder = this.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.category = :category', { category })
            .orderBy('post.createdAt', 'DESC');

        if (search) {
            queryBuilder.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
                search: `%${search}%`
            });
        }

        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const transformedItems = items.map((item, index) => ({
            ...item,
            displayId: ((page - 1) * limit) + index + 1
        }));

        return { 
            items: transformedItems,
            total 
        };
    }

    // 게시물 생성
    async createPost(post: Post): Promise<Post> {
        return await this.save(post);
    }
}
