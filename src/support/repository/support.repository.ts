import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Support } from '../entities/support.entity'; // Post -> Support 로 Entity 변경
import { SupportCategory } from '../enum/support-category.enum'; // PostCategory -> SupportCategory 로 Enum 변경

@Injectable()
export class SupportRepository extends Repository<Support> { // 클래스 이름 변경, PostsRepository -> SupportRepository 로 변경, Post -> Support 로 Entity 변경
    constructor(private dataSource: DataSource) {
        super(Support, dataSource.createEntityManager()); // Post -> Support 로 Entity 변경
    }

    // 카테고리별 게시물 찾기 (함수 이름, Entity, Enum 수정)
    async findByCategory(category: SupportCategory, page: number, limit: number, search?: string) { // findByCategory -> findByCategory, PostCategory -> SupportCategory 로 Enum 변경
        console.log('Repository finding supports for category:', category); // console log 수정

        const queryBuilder = this.createQueryBuilder('support') // queryBuilder alias 수정
            .leftJoinAndSelect('support.author', 'author') // 'post' -> 'support' 로 Entity alias 변경
            .where('support.category = :category', { category }) // 'post' -> 'support' 로 Entity alias 변경
            .orderBy('support.createdAt', 'DESC'); // 'post' -> 'support' 로 Entity alias 변경

        if (search) {
            queryBuilder.andWhere('(support.title LIKE :search OR support.content LIKE :search)', { // queryBuilder alias 수정, 'post' -> 'support' 로 Entity alias 변경
                search: `%${search}%`
            });
        }

        const [items, total] = await queryBuilder // queryBuilder alias 수정
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

    // 게시물 생성 (함수 이름, Entity 수정)
    async createPost(support: Support): Promise<Support> { // createPost -> createSupport, Post -> Support 로 Entity 변경
        return await this.save(support); // post -> support 로 변경
    }
} 