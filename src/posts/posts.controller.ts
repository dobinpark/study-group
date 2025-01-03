import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponse } from './dto/post-response.dto';
import { SuccessResponse } from './interfaces/responses.interface';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { SearchPostDto } from './dto/search-post.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponse> {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponse<PostResponse>> {
    return this.postsService.findAll(page, limit);
  }

  @Get('search')
  search(
    @Query() searchDto: SearchPostDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponse<PostResponse>> {
    return this.postsService.search(searchDto.q, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostResponse> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponse> {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<SuccessResponse> {
    return this.postsService.remove(id, user);
  }
}
