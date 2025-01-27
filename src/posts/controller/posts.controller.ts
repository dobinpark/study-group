import { Controller, Get, Post, Body, Param, Query, UseGuards, Put, ValidationPipe } from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtAuthGuard } from '../../user/auth/jwt-auth.guard';
import { GetUser } from '../../user/auth/get-user.decorator';
import { User } from '../../user/users/entities/user.entity';
import { PostCategory } from '../enum/post-category.enum';
import { UpdatePostDto } from '../dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('category/:category')
    async getPostsByCategory(
        @Param('category') category: PostCategory,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        console.log('Controller received category:', category);
        return await this.postsService.findByCategory(category, {
            page,
            limit,
            search
        });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
        return await this.postsService.createPost(createPostDto, user);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        console.log('Finding post with id:', id);
        return await this.postsService.findOne(id);
    }

    @Post(':id/toggle-like')
    @UseGuards(JwtAuthGuard)
    async toggleLike(
        @Param('id') id: number,
        @GetUser() user: User
    ) {
        return await this.postsService.toggleLike(id, user.id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Param('id') id: number,
        @Body(new ValidationPipe()) updatePostDto: UpdatePostDto,
        @GetUser() user: User
    ) {
        return await this.postsService.updatePost(id, updatePostDto, user);
    }
}
