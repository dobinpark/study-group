import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get(':id')
    getPost(@Param('id') id: string) {
        return this.postsService.getPost(id);
    }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        return this.postsService.createPost(createPostDto);
    }
}
