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

    // 좋아요 증가
    async incrementLike(postId: number): Promise<void> {
        await this.increment({ id: postId }, 'likes', 1);
    }

    // 좋아요 감소
    async decrementLike(postId: number): Promise<void> {
        await this.createQueryBuilder()
            .update(Post)
            .set({ likes: () => "likes - 1" })
            .where("id = :id AND likes > 0", { id: postId })
            .execute();
    }

    // 게시물 좋아요 여부 확인 (세션 스토리지 또는 상태 관리로 처리)
    async checkLikeStatus(postId: number, userId: number): Promise<boolean> {
        // 실제 구현에서는 다른 테이블이나 세션 스토리지를 사용해서 저장/확인할 수 있습니다
        // 지금은 임시로 게시물이 존재하는지만 확인
        const post = await this.findOne({ where: { id: postId } });
        return !!post; // 게시물이 존재하면 true 반환 (실제로는 좋아요 상태 반환)
    }
}
