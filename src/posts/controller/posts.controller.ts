import { Controller, Get, Query, Param } from '@nestjs/common';
import { PostsService } from '../service/posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('category/:category')
    async getPostsByCategory(
        @Param('category') category: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        console.log(`Fetching posts for category: ${category}`); // 디버깅용 로그
        const result = await this.postsService.findByCategory(category, {
            page: +page,
            limit: +limit,
            search
        });
        
        return {
            items: result.items,
            total: result.total
        };
    }
}
