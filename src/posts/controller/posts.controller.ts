import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UnauthorizedException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostCategory } from '../enum/post-category.enum';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from '../../interceptors/response.interceptor';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@ApiTags('게시판')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class PostsController {
    private readonly logger = new Logger(PostsController.name);

    constructor(private readonly postsService: PostsService) { }

    // 카테고리별 게시물 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 게시물 조회' })
    @ApiQuery({ name: 'category', required: true, description: '게시물 카테고리' })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: '페이지당 게시물 수', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: '검색어' })
    async findByCategory(
        @Query('category') category: PostCategory,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        
        console.log(`카테고리 조회: ${category}, 페이지: ${pageNum}, 검색어: ${search || '없음'}`);
        return await this.postsService.findByCategory(category, pageNum, limitNum, search);
    }

    // 게시물 생성
    @Post()
    @UseGuards(AuthenticatedGuard)
    @ApiOperation({ summary: '게시글 작성' })
    @ApiBearerAuth()
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Req() req: Request
    ): Promise<PostEntity> {
        const user = req.user as any;
        
        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }
        
        const userId = user.id;
        this.logger.debug(`게시글 작성 요청: 사용자 ID ${userId}`);
        
        return await this.postsService.createPost({
            ...createPostDto,
            authorId: userId
        });
    }

    // 게시물 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '게시글 상세 조회' })
    @ApiParam({ name: 'id', description: '게시글 ID' })
    async findOne(@Param('id') id: string) {
        this.logger.debug(`게시글 상세 조회: ${id}`);
        const post = await this.postsService.findOne(+id);
        
        return {
            success: true,
            data: post
        };
    }

    // 게시물 수정
    @Put(':id')
    @UseGuards(AuthenticatedGuard)
    @ApiOperation({ summary: '게시글 수정' })
    @ApiBearerAuth()
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req: Request
    ): Promise<PostEntity> {
        const user = req.user as any;
        
        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }
        
        const userId = user.id;
        this.logger.debug(`게시글 수정 요청: ID ${id}, 사용자 ID ${userId}`);
        
        return await this.postsService.updatePost(+id, updatePostDto, userId);
    }

    // 게시물 삭제
    @Delete(':id')
    @UseGuards(AuthenticatedGuard)
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiBearerAuth()
    async deletePost(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<{ message: string }> {
        const user = req.user as any;
        
        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }
        
        const userId = user.id;
        this.logger.debug(`게시글 삭제 요청: ID ${id}, 사용자 ID ${userId}`);
        
        await this.postsService.deletePost(+id, userId);
        return { message: '게시글이 성공적으로 삭제되었습니다' };
    }
}
