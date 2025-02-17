import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards, Req, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { User } from '../../user/entities/user.entity';
import { Post as PostEntity } from '../entities/post.entity';
import { PostCategory } from '../enum/post-category.enum';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('게시판')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // 카테고리별 게시물 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 게시물 조회' })
    @ApiQuery({ name: 'category', required: true, description: '게시물 카테고리' })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: '페이지당 게시물 수', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: '검색어' })
    @ApiOkResponse({ description: '게시물 목록 조회 성공', type: [PostEntity] })
    async findByCategory(
        @Query('category') category: PostCategory,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        return await this.postsService.findByCategory(category, page, limit, search);
    }

    // 게시물 생성
    @Post('create-post')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시물 생성' })
    @ApiCreatedResponse({ description: '게시물 생성 성공', type: PostEntity })
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User
    ): Promise<PostEntity> {
        const postData = {
            ...createPostDto,
            authorId: user.id
        };
        return await this.postsService.createPost(postData);
    }

    // 게시물 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '게시물 상세 조회' })
    @ApiOkResponse({ description: '게시물 상세 정보 반환', type: PostEntity })
    async findOne(@Param('id') id: number) {
        return await this.postsService.findOne(id);
    }

    // 게시물 좋아요 토글
    @Post(':id/toggle-like')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시물 좋아요 토글' })
    @ApiOkResponse({ description: '게시물의 좋아요 상태 변경 성공', schema: { type: 'object', properties: { liked: { type: 'boolean' } } } })
    async toggleLike(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<{ liked: boolean }> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return await this.postsService.toggleLike(id, user.id);
    }

    // 게시물 수정
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시물 수정' })
    @ApiOkResponse({ description: '게시물 수정 성공', type: PostEntity })
    async updatePost(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req: Request,
    ): Promise<PostEntity> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return await this.postsService.updatePost(id, updatePostDto, user);
    }

    // 게시물 삭제
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시물 삭제' })
    @ApiOkResponse({ description: '게시물 삭제 성공', schema: { type: 'object', properties: { message: { type: 'string', example: '게시물이 성공적으로 삭제되었습니다.' } } } })
    async deletePost(
        @Param('id') id: number,
        @Req() req: Request,
    ): Promise<{ message: string }> {
        const user = req.user as User;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.postsService.deletePost(id, user);
        return { message: '게시물이 성공적으로 삭제되었습니다.' };
    }
}
