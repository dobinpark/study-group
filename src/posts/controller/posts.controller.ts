import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Session,
    UnauthorizedException,
    HttpCode,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req,
} from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostCategory } from '../enum/post-category.enum';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CustomSession } from '../../types/session.types';
import { TransformInterceptor } from '../../interceptors/response.interceptor';
import { Request } from 'express';

@ApiTags('게시판')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class PostsController {

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
    @ApiOperation({ summary: '게시물 생성' })
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Req() req: Request
    ): Promise<PostEntity> {
        const userId = req.session?.user?.id;

        if (!userId) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        console.log('Session:', req.session);

        return await this.postsService.createPost({
            ...createPostDto,
            authorId: userId
        });
    }

    // 게시물 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '게시물 상세 조회' })
    async findOne(@Param('id') id: number) {
        return await this.postsService.findOne(id);
    }

    // 게시물 좋아요
    @Post(':id/like')
    @ApiOperation({ summary: '게시물 좋아요' })
    async toggleLike(
        @Param('id') id: number,
        @Session() session: CustomSession
    ): Promise<{ liked: boolean }> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        return await this.postsService.toggleLike(id, session.user.id);
    }

    // 게시물 수정
    @Put(':id')
    @ApiOperation({ summary: '게시물 수정' })
    async updatePost(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @Session() session: CustomSession
    ): Promise<PostEntity> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        return await this.postsService.updatePost(id, updatePostDto, session.user.id);
    }

    // 게시물 삭제
    @Delete(':id')
    @ApiOperation({ summary: '게시물 삭제' })
    async deletePost(
        @Param('id') id: number,
        @Session() session: CustomSession
    ): Promise<{ message: string }> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        await this.postsService.deletePost(id, session.user.id);
        return { message: '게시물이 성공적으로 삭제되었습니다.' };
    }
}
