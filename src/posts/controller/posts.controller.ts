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
} from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostCategory } from '../enum/post-category.enum';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CustomSession } from '../../types/session.types';
import { TransformInterceptor } from '../../interceptors/response.interceptor';

@ApiTags('게시판')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @ApiOperation({ summary: '카테고리별 게시물 조회' })
    @ApiQuery({ name: 'category', required: true, description: '게시물 카테고리' })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: '페이지당 게시물 수', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: '검색어' })
    async findByCategory(
        @Query('category') category: PostCategory,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        return await this.postsService.findByCategory(category, page, limit, search);
    }

    @Post()
    @ApiOperation({ summary: '게시물 생성' })
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Session() session: CustomSession
    ): Promise<PostEntity> {
        if (!session.user) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
        return await this.postsService.createPost({
            ...createPostDto,
            authorId: session.user.id
        });
    }

    @Get(':id')
    @ApiOperation({ summary: '게시물 상세 조회' })
    async findOne(@Param('id') id: number) {
        return await this.postsService.findOne(id);
    }

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
