import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UnauthorizedException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req,
    ParseIntPipe,
    Logger,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostCategory } from './enum/post-category.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { Request } from 'express';
import { DataResponse } from '../types/response.types';

@ApiTags('게시판')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class PostsController {
    private readonly logger = new Logger(PostsController.name);

    constructor(private readonly postsService: PostsService) { }


    // 카테고리별 게시물 조회
    @Get()
    @ApiOperation({ summary: '카테고리별 게시물 조회' })
    @ApiQuery({ name: 'category', required: true, description: '게시물 카테고리', enum: PostCategory })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: '페이지당 게시물 수', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: '검색어', example: '검색어' })
    @ApiResponse({
        status: 200,
        description: '카테고리별 게시물 목록 및 페이지네이션 정보',
        schema: {
            example: {
                success: true,
                data: {
                    items: [
                        {
                            id: 1,
                            title: '게시글 제목입니다',
                            content: '게시글 내용입니다',
                            category: 'FREE',
                            views: 15,
                            author: {
                                id: 1,
                                username: 'user123',
                                nickname: '홍길동'
                            },
                            createdAt: '2023-05-20T12:34:56.789Z',
                            updatedAt: '2023-05-20T12:34:56.789Z',
                            displayNumber: 10
                        },
                        {
                            id: 2,
                            title: '안녕하세요 질문있습니다',
                            content: '이 부분은 어떻게 하나요?',
                            category: 'FREE',
                            views: 8,
                            author: {
                                id: 2,
                                username: 'user456',
                                nickname: '김철수'
                            },
                            createdAt: '2023-05-19T10:24:36.789Z',
                            updatedAt: '2023-05-19T10:24:36.789Z',
                            displayNumber: 9
                        }
                    ],
                    total: 25,
                    page: 1,
                    limit: 10,
                    totalPages: 3
                },
                message: '게시글 목록을 성공적으로 조회했습니다'
            }
        }
    })
    async findByCategory(
        @Query('category') category: PostCategory,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;

        this.logger.debug(`findByCategory 호출 - 카테고리: ${category}, 페이지: ${pageNum}, 제한: ${limitNum}, 검색어: ${search}`);
        console.log(`=== PostsController.findByCategory 메서드 진입 ===`);
        console.log(`findByCategory - category 파라미터 값: ${category}`);
        console.log(`카테고리 조회: ${category}, 페이지: ${pageNum}, 검색어: ${search || '없음'}`);

        const result = await this.postsService.findByCategory(category, pageNum, limitNum, search);

        return {
            success: true,
            data: result,
            message: '게시글 목록을 성공적으로 조회했습니다'
        };
    }


    // 게시물 생성
    @Post()
    @ApiOperation({ summary: '게시글 작성' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreatePostDto,
        description: '게시글 작성 정보',
        examples: {
            '기본 예제': {
                value: {
                    title: '새 게시글 제목',
                    content: '게시글 내용입니다. 마크다운 형식도 지원됩니다.',
                    category: 'FREE'
                }
            },
            '질문 게시글': {
                value: {
                    title: '질문이 있습니다',
                    content: '이 기능은 어떻게 사용하나요?',
                    category: 'QUESTION'
                }
            }
        }
    })
    @ApiCreatedResponse({ description: '게시글 생성 성공', type: DataResponse })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Req() req: Request
    ): Promise<DataResponse<PostEntity>> {
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }

        const userId = user.id;
        this.logger.debug(`게시글 작성 요청: 사용자 ID ${userId}`);

        try {
            const post = await this.postsService.createPost({
                ...createPostDto,
                authorId: userId
            });

            return {
                success: true,
                data: post,
                message: '게시글이 성공적으로 작성되었습니다'
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`게시글 생성 실패: ${errorMessage}`);
            throw new InternalServerErrorException('게시글 생성 중 오류가 발생했습니다.');
        }
    }


    // 게시물 상세 조회
    @Get(':id')
    @ApiOperation({ summary: '게시글 상세 조회' })
    @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '게시글 상세 정보',
        schema: {
            example: {
                success: true,
                data: {
                    id: 1,
                    title: '게시글 제목입니다',
                    content: '게시글 내용입니다. 상세한 내용이 여기에 표시됩니다.',
                    category: 'FREE',
                    views: 16, // 조회 시 views가 증가함
                    author: {
                        id: 1,
                        username: 'user123',
                        nickname: '홍길동'
                    },
                    createdAt: '2023-05-20T12:34:56.789Z',
                    updatedAt: '2023-05-20T12:34:56.789Z'
                },
                message: '게시글을 성공적으로 조회했습니다'
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '게시글을 찾을 수 없음',
        schema: {
            example: {
                success: false,
                message: '게시물을 찾을 수 없습니다',
                statusCode: 404
            }
        }
    })
    async findOne(@Param('id') id: string) {
        this.logger.debug(`게시글 상세 조회: ${id}`);
        const post = await this.postsService.findOne(+id);

        return {
            success: true,
            data: post,
            message: '게시글을 성공적으로 조회했습니다'
        };
    }


    // 게시물 수정
    @Put(':id')
    @ApiOperation({ summary: '게시글 수정' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
    @ApiBody({
        type: UpdatePostDto,
        description: '게시글 수정 정보',
        examples: {
            '제목 수정': {
                value: {
                    title: '수정된 게시글 제목'
                }
            },
            '내용 수정': {
                value: {
                    content: '수정된 게시글 내용입니다.'
                }
            },
            '전체 수정': {
                value: {
                    title: '수정된 게시글 제목',
                    content: '수정된 게시글 내용입니다.',
                    category: 'SUGGESTION'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: '게시글 수정 성공',
        schema: {
            example: {
                success: true,
                data: {
                    id: 1,
                    title: '수정된 게시글 제목',
                    content: '수정된 게시글 내용입니다.',
                    category: 'FREE',
                    views: 16,
                    authorId: 1,
                    createdAt: '2023-05-20T12:34:56.789Z',
                    updatedAt: '2023-05-21T09:45:12.456Z'
                },
                message: '게시글이 성공적으로 수정되었습니다'
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: '수정 권한 없음',
        schema: {
            example: {
                success: false,
                message: '게시물을 수정할 권한이 없습니다',
                statusCode: 403
            }
        }
    })
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req: Request
    ): Promise<PostEntity> {
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }

        const userId = user.id;
        this.logger.debug(`게시글 수정 요청: ID ${id}, 사용자 ID ${userId}`);

        const updatedPost = await this.postsService.updatePost(+id, updatePostDto, userId);
        return updatedPost;
    }


    // 게시물 삭제
    @Delete(':id')
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: '게시글 삭제 성공',
        schema: {
            example: {
                success: true,
                message: '게시글이 성공적으로 삭제되었습니다'
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: '삭제 권한 없음',
        schema: {
            example: {
                success: false,
                message: '게시물을 삭제할 권한이 없습니다',
                statusCode: 403
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '게시글을 찾을 수 없음',
        schema: {
            example: {
                success: false,
                message: '게시물을 찾을 수 없습니다',
                statusCode: 404
            }
        }
    })
    async deletePost(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<{ message: string }> {
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }

        const userId = user.id;
        this.logger.debug(`게시글 삭제 요청: ID ${id}, 사용자 ID ${userId}`);

        await this.postsService.deletePost(+id, userId);
        return { message: '게시글이 성공적으로 삭제되었습니다' };
    }
}
