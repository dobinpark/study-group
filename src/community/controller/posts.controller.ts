import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '../../user/auth/jwt-auth.guard';
import { GetUser } from '../../user/auth/get-user.decorator';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';

@ApiTags('게시글')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시글 작성' })
    @ApiResponse({ status: 201, description: '게시글이 작성되었습니다.' })
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User
    ) {
        return this.postsService.createPost(createPostDto, user);
    }

    @Get()
    @ApiOperation({ summary: '게시글 목록 조회' })
    @ApiQuery({ name: 'category', enum: PostCategory, required: false })
    @ApiResponse({ status: 200, description: '게시글 목록을 반환합니다.' })
    async findAll(@Query('category') category?: PostCategory) {
        return this.postsService.findAll(category);
    }

    @Get(':id')
    @ApiOperation({ summary: '게시글 상세 조회' })
    @ApiResponse({ status: 200, description: '게시글 상세 정보를 반환합니다.' })
    async findOne(@Param('id') id: number) {
        return this.postsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시글 수정' })
    @ApiResponse({ status: 200, description: '게시글이 수정되었습니다.' })
    async updatePost(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @GetUser() user: User
    ) {
        return this.postsService.updatePost(id, updatePostDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiResponse({ status: 200, description: '게시글이 삭제되었습니다.' })
    async deletePost(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        await this.postsService.deletePost(id, user);
        return { message: '게시글이 성공적으로 삭제되었습니다.' };
    }

    @Post(':id/like')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '게시글 좋아요' })
    @ApiResponse({ status: 200, description: '게시글 좋아요가 처리되었습니다.' })
    async likePost(@Param('id') id: number) {
        return this.postsService.likePost(id);
    }
} 