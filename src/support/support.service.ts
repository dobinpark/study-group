import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Support } from './entities/support.entity'; // Post -> Support 로 Entity 변경
import { CreateSupportDto } from './dto/create-support.dto'; // CreatePostDto -> CreateSupportDto 로 DTO 변경
import { UpdateSupportDto } from './dto/update-support.dto'; // UpdatePostDto -> UpdateSupportDto 로 DTO 변경
import { SupportCategory } from './enum/support-category.enum'; // PostCategory -> SupportCategory 로 Enum 변경
import { SupportRepository } from './repository/support.repository'; // PostsRepository -> SupportRepository 로 Repository 변경
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface CreateSupportParams extends CreateSupportDto { // CreatePostParams -> CreateSupportParams 로 인터페이스 변경, CreatePostDto -> CreateSupportDto 로 DTO 변경
    authorId: number;
}

@Injectable()
export class SupportService { // 클래스 이름 변경
    private readonly logger = new Logger(SupportService.name); // Logger 이름 변경

    constructor(
        @InjectRepository(Support) // Post -> Support 로 Entity 변경
        private readonly supportRepository: Repository<Support>, // postRepository -> supportRepository, Post -> Support 로 변경
        private readonly supportsRepository: SupportRepository, // postsRepository -> supportsRepository, PostsRepository -> SupportRepository 로 변경
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    // 게시물 생성 (함수 이름, Entity, DTO, Exception 수정)
    async createPost(params: CreateSupportParams): Promise<Support> { // createPost -> createSupport, CreatePostParams -> CreateSupportParams, Post -> Support 로 변경
        const { title, content, category, authorId } = params;

        if (!authorId) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        const support = this.supportRepository.create({ // postRepository -> supportRepository, post -> support 로 변경
            title,
            content,
            category,
            authorId,
            views: 0,
        });

        const savedSupport = await this.supportRepository.save(support); // postRepository -> supportRepository, savedPost -> savedSupport, post -> support 로 변경

        // 게시판 캐시 무효화
        await this.invalidateListCache();

        return savedSupport; // savedPost -> savedSupport 로 변경
    }

    // 카테고리별 게시물 조회 (함수 이름, Entity, Enum 수정)
    async findByCategory(
        category: SupportCategory, // PostCategory -> SupportCategory 로 Enum 변경
        page: number = 1,
        limit: number = 10,
        search?: string
    ) {
        console.log('Searching supports with category:', category); // console log 수정

        // 숫자 타입 보장
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        // 카테고리별 총 게시글 수 먼저 조회
        const totalQuery = this.supportRepository.createQueryBuilder('support') // postRepository -> supportRepository, 'post' -> 'support' 로 Entity alias 변경
            .where('support.category = :category', { category }); // 'post' -> 'support' 로 Entity alias 변경

        if (search) {
            totalQuery.andWhere( // totalQuery alias 수정
                '(support.title LIKE :search OR support.content LIKE :search)', // 'post' -> 'support' 로 Entity alias 변경
                { search: `%${search}%` }
            );
        }

        const total = await totalQuery.getCount();

        const queryBuilder = this.supportRepository.createQueryBuilder('support') // postRepository -> supportRepository, queryBuilder alias 수정
            .leftJoinAndSelect('support.author', 'author') // 'post' -> 'support' 로 Entity alias 변경
            .where('support.category = :category', { category }) // 'post' -> 'support' 로 Entity alias 변경
            .orderBy('support.createdAt', 'DESC'); // 'post' -> 'support' 로 Entity alias 변경

        if (search) {
            queryBuilder.andWhere( // queryBuilder alias 수정
                '(support.title LIKE :search OR support.content LIKE :search)', // 'post' -> 'support' 로 Entity alias 변경
                { search: `%${search}%` }
            );
        }

        const skip = (pageNum - 1) * limitNum;
        console.log('Skip value:', skip, 'Type:', typeof skip);

        const items = await queryBuilder // queryBuilder alias 수정
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

        console.log('Found supports:', items.length, 'Total:', total); // console log 수정

        return {
            items: processedItems,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        };
    }

    // 게시물 상세 조회 (함수 이름, Entity, Exception 수정)
    async findOne(id: number): Promise<Support> { // findOne -> findOne, Post -> Support 로 변경
        const cacheKey = `support_${id}`; // cache key 수정

        // 캐시에서 데이터 조회 시도
        const cachedSupport = await this.cacheManager.get<Support>(cacheKey); // cachedPost -> cachedSupport, Post -> Support 로 변경
        if (cachedSupport) { // cachedPost -> cachedSupport 로 변경
            this.logger.debug(`캐시에서 고객센터 게시글 반환: ${id}`); // logger message 수정
            return cachedSupport; // cachedPost -> cachedSupport 로 변경
        }

        const support = await this.supportRepository.findOne({ // postRepository -> supportRepository, post -> support 로 변경
            where: { id },
            relations: ['author']
        });

        if (!support) { // post -> support 로 변경
            throw new NotFoundException('고객센터 게시물을 찾을 수 없습니다.'); // exception message 수정
        }

        // 조회수 증가
        await this.supportRepository.increment({ id }, 'views', 1); // postRepository -> supportRepository
        support.views += 1; // post -> support 로 변경

        // 결과 캐싱
        await this.cacheManager.set(cacheKey, support, 300); // cache key, post -> support 로 변경, 5분 캐싱

        return support; // post -> support 로 변경
    }

    // 게시물 수정 (함수 이름, Entity, DTO, Exception 수정)
    async updatePost(id: number, updateSupportDto: UpdateSupportDto, userId: number): Promise<Support> { // updatePost -> updateSupport, UpdatePostDto -> UpdateSupportDto, Post -> Support 로 변경
        const support = await this.findOne(id); // post -> support 로 변경

        if (support.authorId !== userId) { // post -> support 로 변경
            throw new ForbiddenException('고객센터 게시물을 수정할 권한이 없습니다.'); // exception message 수정
        }

        Object.assign(support, updateSupportDto); // post -> support 로 변경
        const updatedSupport = await this.supportRepository.save(support); // postRepository -> supportRepository, updatedPost -> updatedSupport, post -> support 로 변경

        // 캐시 무효화
        await this.invalidateCache(id);

        return updatedSupport; // updatedPost -> updatedSupport 로 변경
    }

    // 게시물 삭제 (함수 이름, Entity, Exception 수정)
    async deletePost(id: number, userId: number): Promise<void> { // deletePost -> deleteSupport, Post -> Support 로 변경
        const support = await this.findOne(id); // post -> support 로 변경

        if (support.authorId !== userId) { // post -> support 로 변경
            throw new ForbiddenException('고객센터 게시물을 삭제할 권한이 없습니다.'); // exception message 수정
        }

        await this.supportRepository.delete(id); // postRepository -> supportRepository

        // 캐시 무효화
        await this.invalidateCache(id);
        await this.invalidateListCache();
    }

    // 특정 게시글 캐시 무효화 (함수 이름, cache key 수정)
    private async invalidateCache(id: number): Promise<void> { // invalidateCache -> invalidateCache
        const cacheKey = `support_${id}`; // cache key 수정
        await this.cacheManager.del(cacheKey);
        this.logger.debug(`고객센터 게시글 캐시 무효화: ${id}`); // logger message 수정
    }

    // 게시글 목록 캐시 무효화 (함수 이름, cache key 수정)
    private async invalidateListCache(): Promise<void> { // invalidateListCache -> invalidateListCache
        // 캐시 키 패턴은 지원되지 않으므로, 주요 목록만 무효화
        const categories = ['all', 'NOTICE', 'FAQ', 'INQUIRY']; // PostCategory -> SupportCategory 로 변경, categories 수정

        for (const category of categories) {
            await this.cacheManager.del(`supports_list_${category}_1_10`); // 'posts' -> 'supports' 로 cache key 수정
        }

        this.logger.debug('고객센터 게시글 목록 캐시 무효화 완료'); // logger message 수정
    }
} 