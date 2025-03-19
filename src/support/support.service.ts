import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Support } from './entities/support.entity';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportCategory } from './enum/support-category.enum';
import { SupportRepository } from './repository/support.repository';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface CreateSupportParams extends CreateSupportDto {
    authorId: number;
}

@Injectable()
export class SupportService {
    private readonly logger = new Logger(SupportService.name);

    constructor(
        @InjectRepository(Support)
        private readonly supportRepository: Repository<Support>,
        private readonly supportsRepository: SupportRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    // 게시물 생성
    async createPost(params: CreateSupportParams): Promise<Support> {
        const { title, content, category, authorId } = params;

        if (!authorId) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        const support = this.supportRepository.create({
            title,
            content,
            category,
            authorId,
            views: 0,
        });

        const savedSupport = await this.supportRepository.save(support);

        // 게시판 캐시 무효화
        await this.invalidateListCache();

        return savedSupport;
    }

    // 카테고리별 게시물 조회
    async findByCategory(
        category: SupportCategory,
        page: number = 1,
        limit: number = 10,
        search?: string
    ) {
        console.log('Searching supports with category:', category);

        // 숫자 타입 보장
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        // 카테고리별 총 게시글 수 먼저 조회
        const totalQuery = this.supportRepository.createQueryBuilder('support')
            .where('support.category = :category', { category });

        if (search) {
            totalQuery.andWhere(
                '(support.title LIKE :search OR support.content LIKE :search)',
                { search: `%${search}%` }
            );
        }

        const total = await totalQuery.getCount();

        const queryBuilder = this.supportRepository.createQueryBuilder('support')
            .leftJoinAndSelect('support.author', 'author')
            .where('support.category = :category', { category })
            .orderBy('support.createdAt', 'DESC');

        if (search) {
            queryBuilder.andWhere(
                '(support.title LIKE :search OR support.content LIKE :search)',
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

        console.log('Found supports:', items.length, 'Total:', total);

        return {
            items: processedItems,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        };
    }

    // 게시물 상세 조회
    async findOne(id: number): Promise<Support> {
        const cacheKey = `support_${id}`;

        // 캐시에서 데이터 조회 시도
        const cachedSupport = await this.cacheManager.get<Support>(cacheKey);
        if (cachedSupport) {
            this.logger.debug(`캐시에서 고객센터 게시글 반환: ${id}`);
            return cachedSupport;
        }

        const support = await this.supportRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!support) {
            throw new NotFoundException('고객센터 게시물을 찾을 수 없습니다.');
        }

        // 조회수 증가
        await this.supportRepository.increment({ id }, 'views', 1);
        support.views += 1;

        // 결과 캐싱
        await this.cacheManager.set(cacheKey, support, 300);

        return support;
    }

    // 게시물 수정
    async update(id: number, updateSupportDto: UpdateSupportDto, userId: number): Promise<Support> {
        const support = await this.findOne(id);

        if (support.authorId !== userId) {
            throw new ForbiddenException('고객센터 게시물을 수정할 권한이 없습니다.');
        }

        Object.assign(support, updateSupportDto);
        const updatedSupport = await this.supportRepository.save(support);

        // 캐시 무효화
        await this.invalidateCache(id);

        return updatedSupport;
    }

    // 게시물 삭제
    async deletePost(id: number, userId: number): Promise<void> {
        const support = await this.findOne(id);

        if (support.authorId !== userId) {
            throw new ForbiddenException('고객센터 게시물을 삭제할 권한이 없습니다.');
        }

        await this.supportRepository.delete(id);

        // 캐시 무효화
        await this.invalidateCache(id);
        await this.invalidateListCache();
    }

    // 특정 게시글 캐시 무효화
    private async invalidateCache(id: number): Promise<void> {
        const cacheKey = `support_${id}`;
        await this.cacheManager.del(cacheKey);
        this.logger.debug(`고객센터 게시글 캐시 무효화: ${id}`);
    }

    // 게시글 목록 캐시 무효화
    private async invalidateListCache(): Promise<void> {
        // 캐시 키 패턴은 지원되지 않으므로, 주요 목록만 무효화
        const categories = ['all', 'NOTICE', 'FAQ', 'INQUIRY'];

        for (const category of categories) {
            await this.cacheManager.del(`supports_list_${category}_1_10`);
        }

        this.logger.debug('고객센터 게시글 목록 캐시 무효화 완료');
    }
}
