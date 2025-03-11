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
    UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Support as SupportEntity } from './entities/support.entity';
import { SupportCategory } from './enum/support-category.enum'; // SupportCategory enum import
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/response.interceptor';
import { Request } from 'express';
import { DataResponse } from '../types/response.types';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('고객센터') // ApiTags 수정
@Controller('supports') // Controller 경로 수정
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class SupportController { // 클래스 이름 수정
    private readonly logger = new Logger(SupportController.name); // Logger 이름 수정

    constructor(private readonly supportService: SupportService) { } // PostsService -> SupportService 로 변경


    // 카테고리별 게시물 조회 (API summary, description 수정)
    @Get()
    @ApiOperation({ summary: '카테고리별 고객센터 게시글 조회' })
    @ApiQuery({ name: 'category', required: true, description: '고객센터 게시글 카테고리', enum: SupportCategory }) // enum 수정: SupportCategory
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: '페이지당 게시물 수', example: 10 })
    @ApiQuery({ name: 'search', required: false, description: '검색어', example: '검색어' })
    @ApiResponse({
        status: 200,
        description: '카테고리별 고객센터 게시글 목록 및 페이지네이션 정보', // description 수정
        schema: {
            example: {
                success: true,
                data: {
                    items: [
                        {
                            id: 1,
                            title: '공지사항 제목입니다', // title 예시 수정
                            content: '공지사항 내용입니다', // content 예시 수정
                            category: 'NOTICE', // category 예시 수정
                            views: 15,
                            author: {
                                id: 1,
                                username: 'user123',
                                nickname: '홍길동'
                            },
                            createdAt: '2024-01-25T12:34:56.789Z', // createdAt 예시 수정
                            updatedAt: '2024-01-25T12:34:56.789Z', // updatedAt 예시 수정
                            displayNumber: 10
                        },
                        {
                            id: 2,
                            title: '자주 묻는 질문입니다', // title 예시 수정
                            content: '자주 묻는 질문 내용입니다.', // content 예시 수정
                            category: 'FAQ', // category 예시 수정
                            views: 8,
                            author: {
                                id: 2,
                                username: 'user456',
                                nickname: '김철수'
                            },
                            createdAt: '2024-01-24T10:24:36.789Z', // createdAt 예시 수정
                            updatedAt: '2024-01-24T10:24:36.789Z', // updatedAt 예시 수정
                            displayNumber: 9
                        }
                    ],
                    total: 25,
                    page: 1,
                    limit: 10,
                    totalPages: 3
                },
                message: '고객센터 게시글 목록을 성공적으로 조회했습니다' // message 수정
            }
        }
    })
    async findByCategory(
        @Query('category') category: SupportCategory,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;

        this.logger.debug(`findByCategory 호출 - 카테고리: ${category}, 페이지: ${pageNum}, 제한: ${limitNum}, 검색어: ${search}`);
        console.log(`=== SupportController.findByCategory 메서드 진입 ===`); // 컨트롤러 이름 수정
        console.log(`findByCategory - category 파라미터 값: ${category}`);
        console.log(`카테고리 조회: ${category}, 페이지: ${pageNum}, 검색어: ${search || '없음'}`);

        const result = await this.supportService.findByCategory(category, pageNum, limitNum, search); // postsService -> supportService 로 변경

        return {
            success: true,
            data: result,
            message: '고객센터 게시글 목록을 성공적으로 조회했습니다' // message 수정
        };
    }


    // 게시물 생성 (API summary, description 수정, DTO, Service, Entity, Exception 수정)
    @Post()
    @UseGuards(AuthGuard) // AuthGuard 추가
    @ApiOperation({ summary: '고객센터 게시글 작성' })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateSupportDto, // CreatePostDto -> CreateSupportDto 로 변경
        description: '고객센터 게시글 작성 정보', // description 수정
        examples: {
            '공지사항 작성 예제': { // example title 수정
                value: {
                    title: '새로운 공지사항', // title 예시 수정
                    content: '공지사항 내용입니다. 마크다운 형식도 지원됩니다.', // content 예시 수정
                    category: 'NOTICE' // category 예시 수정
                }
            },
            '자주 묻는 질문 작성 예제': { // example title 수정
                value: {
                    title: '자주 묻는 질문입니다', // title 예시 수정
                    content: '자주 묻는 질문 내용입니다.', // content 예시 수정
                    category: 'FAQ' // category 예시 수정
                }
            }
        }
    })
    @ApiCreatedResponse({ description: '고객센터 게시글 생성 성공', type: DataResponse }) // description 수정
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    async createPost(
        @Body() createSupportDto: CreateSupportDto, // CreatePostDto -> CreateSupportDto 로 변경
        @Req() req: Request
    ): Promise<DataResponse<SupportEntity>> { // PostEntity -> SupportEntity 로 변경
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }

        const userId = user.id;
        this.logger.debug(`고객센터 게시글 작성 요청: 사용자 ID ${userId}`); // logger message 수정

        try {
            const support = await this.supportService.createPost({ // postsService -> supportService, createPost -> createSupport 로 변경
                ...createSupportDto,
                authorId: userId
            });

            return {
                success: true,
                data: support, // post -> support 로 변경
                message: '고객센터 게시글이 성공적으로 작성되었습니다' // message 수정
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            this.logger.error(`고객센터 게시글 생성 실패: ${errorMessage}`); // logger message 수정
            throw new InternalServerErrorException('고객센터 게시글 생성 중 오류가 발생했습니다.'); // error message 수정
        }
    }


    // 게시물 상세 조회 (API summary, description 수정, Service, Entity 수정)
    @Get(':id')
    @ApiOperation({ summary: '고객센터 게시글 상세 조회' })
    @ApiParam({ name: 'id', description: '고객센터 게시글 ID', example: 1 }) // description 수정
    @ApiResponse({
        status: 200,
        description: '고객센터 게시글 상세 정보', // description 수정
        schema: {
            example: {
                success: true,
                data: {
                    id: 1,
                    title: '공지사항 제목입니다', // title 예시 수정
                    content: '공지사항 내용입니다. 상세한 내용이 여기에 표시됩니다.', // content 예시 수정
                    category: 'NOTICE', // category 예시 수정
                    views: 16, // 조회 시 views가 증가함
                    author: {
                        id: 1,
                        username: 'user123',
                        nickname: '홍길동'
                    },
                    createdAt: '2024-01-25T12:34:56.789Z', // createdAt 예시 수정
                    updatedAt: '2024-01-25T12:34:56.789Z' // updatedAt 예시 수정
                },
                message: '고객센터 게시글을 성공적으로 조회했습니다' // message 수정
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '고객센터 게시글을 찾을 수 없음', // description 수정
        schema: {
            example: {
                success: false,
                message: '고객센터 게시물을 찾을 수 없습니다', // message 수정
                statusCode: 404
            }
        }
    })
    async findOne(@Param('id') id: string) {
        this.logger.debug(`고객센터 게시글 상세 조회: ${id}`); // logger message 수정
        const support = await this.supportService.findOne(+id); // postsService -> supportService, post -> support 로 변경

        return {
            success: true,
            data: support, // post -> support 로 변경
            message: '고객센터 게시글을 성공적으로 조회했습니다' // message 수정
        };
    }


    // 게시물 수정 (API summary, description 수정, DTO, Service, Entity, Exception 수정)
    @Put(':id')
    @UseGuards(AuthGuard) // AuthGuard 추가
    @ApiOperation({ summary: '고객센터 게시글 수정' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: '고객센터 게시글 ID', example: 1 }) // description 수정
    @ApiBody({
        type: UpdateSupportDto, // UpdatePostDto -> UpdateSupportDto 로 변경
        description: '고객센터 게시글 수정 정보', // description 수정
        examples: {
            '제목 수정': { // example title 수정
                value: {
                    title: '수정된 공지사항 제목' // title 예시 수정
                }
            },
            '내용 수정': { // example title 수정
                value: {
                    content: '수정된 공지사항 내용입니다.' // content 예시 수정
                }
            },
            '전체 수정': { // example title 수정
                value: {
                    title: '수정된 공지사항 제목', // title 예시 수정
                    content: '수정된 공지사항 내용입니다.', // content 예시 수정
                    category: 'NOTICE' // category 예시 수정, PostCategory -> SupportCategory 로 변경
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: '고객센터 게시글 수정 성공', // description 수정
        schema: {
            example: {
                success: true,
                data: {
                    id: 1,
                    title: '수정된 공지사항 제목', // title 예시 수정
                    content: '수정된 공지사항 내용입니다.', // content 예시 수정
                    category: 'NOTICE', // category 예시 수정
                    views: 16,
                    authorId: 1,
                    createdAt: '2024-01-25T12:34:56.789Z', // createdAt 예시 수정
                    updatedAt: '2024-01-26T09:45:12.456Z' // updatedAt 예시 수정
                },
                message: '고객센터 게시글이 성공적으로 수정되었습니다' // message 수정
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: '수정 권한 없음', // description 수정
        schema: {
            example: {
                success: false,
                message: '고객센터 게시물을 수정할 권한이 없습니다', // message 수정
                statusCode: 403
            }
        }
    })
    async updatePost(
        @Param('id') id: string,
        @Body() updateSupportDto: UpdateSupportDto, // UpdatePostDto -> UpdateSupportDto 로 변경
        @Req() req: Request
    ): Promise<SupportEntity> { // PostEntity -> SupportEntity 로 변경
        const user = req.user as any;

        if (!user || !user.id) {
            throw new UnauthorizedException('로그인이 필요합니다');
        }

        const userId = user.id;
        this.logger.debug(`고객센터 게시글 수정 요청: ID ${id}, 사용자 ID ${userId}`); // logger message 수정

        const updatedSupport = await this.supportService.updatePost(+id, updateSupportDto, userId); // postsService -> supportService, updatePost -> updateSupport, updatedPost -> updatedSupport 로 변경
        return updatedSupport; // updatedPost -> updatedSupport 로 변경
    }


    // 게시물 삭제 (API summary, description 수정, Service, Exception 수정)
    @Delete(':id')
    @UseGuards(AuthGuard) // AuthGuard 추가
    @ApiOperation({ summary: '고객센터 게시글 삭제' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: '고객센터 게시글 ID', example: 1 }) // description 수정
    @ApiResponse({
        status: 200,
        description: '고객센터 게시글 삭제 성공', // description 수정
        schema: {
            example: {
                success: true,
                message: '고객센터 게시글이 성공적으로 삭제되었습니다' // message 수정
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: '삭제 권한 없음', // description 수정
        schema: {
            example: {
                success: false,
                message: '고객센터 게시물을 삭제할 권한이 없습니다', // message 수정
                statusCode: 403
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: '고객센터 게시글을 찾을 수 없음', // description 수정
        schema: {
            example: {
                success: false,
                message: '고객센터 게시물을 찾을 수 없습니다', // message 수정
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
        this.logger.debug(`고객센터 게시글 삭제 요청: ID ${id}, 사용자 ID ${userId}`); // logger message 수정

        await this.supportService.deletePost(+id, userId); // postsService -> supportService, deletePost -> deleteSupport 로 변경
        return { message: '고객센터 게시글이 성공적으로 삭제되었습니다' }; // message 수정
    }
} 