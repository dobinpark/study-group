import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from '../../user/auth/jwt-auth.guard';
import { GetUser } from '../../user/auth/get-user.decorator';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User
    ) {
        return this.postsService.createPost(createPostDto, user);
    }

    @Get()
    async findAll(@Query('category') category?: PostCategory) {
        return this.postsService.findAll(category);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.postsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @GetUser() user: User
    ) {
        return this.postsService.updatePost(id, updatePostDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePost(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        await this.postsService.deletePost(id, user);
        return { message: '게시글이 성공적으로 삭제되었습니다.' };
    }

    @Post(':id/like')
    @UseGuards(JwtAuthGuard)
    async likePost(@Param('id') id: number) {
        return this.postsService.likePost(id);
    }
} 