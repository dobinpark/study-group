import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { User } from '../../user/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('게시물')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // 카테고리별 게시물 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 게시물 조회' })
    @ApiQuery({ name: 'category', required: true })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiResponse({ status: 200, description: '게시물 목록을 반환합니다.' })
    async findByCategory(
        @Query('category') category: PostCategory,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        console.log('Controller received category:', category);
        return await this.postsService.findByCategory(category, page, limit, search);
    }

    // 게시물 생성
    @Post()
    @ApiOperation({ summary: '게시물 생성' })
    @ApiResponse({ status: 201, description: '게시물이 생성되었습니다.' })
    async createPost(@Body() createPostDto: CreatePostDto, user: User) {
        return await this.postsService.createPost(createPostDto, user);
    }

    // 게시물 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '게시물 상세 조회' })
    @ApiResponse({ status: 200, description: '게시물 상세 정보를 반환합니다.' })
    async findOne(@Param('id') id: number) {
        console.log('Finding post with id:', id);
        return await this.postsService.findOne(id);
    }

    // 게시물 좋아요 토글
    @Post(':id/toggle-like')
    @ApiOperation({ summary: '게시물 좋아요 토글' })
    @ApiResponse({ status: 200, description: '게시물의 좋아요 상태가 변경되었습니다.' })
    async toggleLike(
        @Param('id') id: number,
        user: User
    ) {
        return await this.postsService.toggleLike(id, user.id);
    }

    // 게시물 수정
    @Put(':id')
    @ApiOperation({ summary: '게시물 수정' })
    @ApiResponse({ status: 200, description: '게시물이 수정되었습니다.' })
    async updatePost(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        user: User
    ) {
        return await this.postsService.updatePost(id, updatePostDto, user);
    }

    // 게시물 삭제
    @Delete(':id')
    @ApiOperation({ summary: '게시물 삭제' })
    @ApiResponse({ status: 200, description: '게시물이 삭제되었습니다.' })
    async deletePost(
        @Param('id') id: number,
        user: User
    ): Promise<{ message: string }> {
        await this.postsService.deletePost(id, user);
        return { message: '게시물이 성공적으로 삭제되었습니다.' };
    }
}
