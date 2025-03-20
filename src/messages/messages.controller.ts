import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    Req,
    Logger,
    InternalServerErrorException,
    Patch
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    getSchemaPath,
    ApiHeader,
    ApiParam
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { DataResponse, BaseResponse } from '../types/response.types';
import { Request } from 'express';
import { MessageResponseDto } from './dto/message-response.dto';
import { User } from '../user/entities/user.entity';

@ApiTags('쪽지')
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly logger: Logger
    ) { }


    // 쪽지 보내기
    @ApiOperation({ summary: '쪽지 보내기' })
    @ApiBody({
        type: CreateMessageDto,
        description: '보낼 쪽지 정보'
    })
    @ApiCreatedResponse({
        description: '쪽지 보내기 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(MessageResponseDto) }
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: '잘못된 요청' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createMessageDto: CreateMessageDto,
        @Req() req: Request
    ): Promise<DataResponse<Message>> {
        try {
            const user = req.user as User;
            const message = await this.messagesService.sendMessage(createMessageDto, user.id);
            return { success: true, data: message };
        } catch (error: any) {
            this.logger.error(`쪽지 보내기 실패: ${error.message}`);
            throw error;
        }
    }


    // 받은 쪽지 목록 조회
    @ApiOperation({ summary: '받은 쪽지 목록 조회' })
    @ApiOkResponse({
        description: '받은 쪽지 목록 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(MessageResponseDto) }
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Get('received')
    async getReceivedMessages(@Req() req: Request): Promise<DataResponse<Message[]>> {
        try {
            const user = req.user as User;
            const messages = await this.messagesService.getReceivedMessages(user.id);
            return { success: true, data: messages };
        } catch (error: any) {
            this.logger.error(`받은 쪽지 목록 조회 실패: ${error.message}`);
            throw error;
        }
    }


    // 보낸 쪽지 목록 조회
    @ApiOperation({ summary: '보낸 쪽지 목록 조회' })
    @ApiOkResponse({
        description: '보낸 쪽지 목록 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(MessageResponseDto) }
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Get('sent')
    async getSentMessages(@Req() req: Request): Promise<DataResponse<Message[]>> {
        try {
            const user = req.user as User;
            const messages = await this.messagesService.getSentMessages(user.id);
            return { success: true, data: messages };
        } catch (error: any) {
            this.logger.error(`보낸 쪽지 목록 조회 실패: ${error.message}`);
            throw error;
        }
    }


    // 읽지 않은 쪽지 개수 조회
    @ApiOperation({ summary: '읽지 않은 쪽지 개수 조회' })
    @ApiOkResponse({
        description: '읽지 않은 쪽지 개수 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: {
                            type: 'number',
                            example: 5
                        }
                    }
                }
            ]
        }
    })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Get('unread/count')
    async getUnreadCount(@Req() req: Request): Promise<DataResponse<number>> {
        try {
            const user = req.user as User;
            const count = await this.messagesService.getUnreadCount(user.id);
            return { success: true, data: count };
        } catch (error: any) {
            this.logger.error(`읽지 않은 쪽지 개수 조회 실패: ${error.message}`);
            throw error;
        }
    }


    // 쪽지 상세 조회
    @ApiOperation({ summary: '쪽지 상세 조회' })
    @ApiParam({ name: 'id', description: '쪽지 ID' })
    @ApiOkResponse({
        description: '쪽지 상세 조회 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(DataResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(MessageResponseDto) }
                    }
                }
            ]
        }
    })
    @ApiNotFoundResponse({ description: '쪽지를 찾을 수 없음' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Get(':id')
    async getMessageById(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<DataResponse<Message>> {
        try {
            const user = req.user as User;
            const message = await this.messagesService.getMessageById(id, user.id);
            return { success: true, data: message };
        } catch (error: any) {
            this.logger.error(`쪽지 상세 조회 실패: ${error.message}`);
            throw error;
        }
    }


    // 쪽지 삭제
    @ApiOperation({ summary: '쪽지 삭제' })
    @ApiParam({ name: 'id', description: '쪽지 ID' })
    @ApiOkResponse({
        description: '쪽지 삭제 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) }
            ]
        }
    })
    @ApiNotFoundResponse({ description: '쪽지를 찾을 수 없음' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Delete(':id')
    async deleteMessage(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.messagesService.deleteMessage(id, user.id);
            return { success: true };
        } catch (error: any) {
            this.logger.error(`쪽지 삭제 실패: ${error.message}`);
            throw error;
        }
    }

    // 쪽지 읽음 상태로 변경
    @ApiOperation({ summary: '쪽지 읽음 상태로 변경' })
    @ApiParam({ name: 'id', description: '쪽지 ID' })
    @ApiOkResponse({
        description: '쪽지 읽음 상태 변경 성공',
        schema: {
            allOf: [
                { $ref: getSchemaPath(BaseResponse) }
            ]
        }
    })
    @ApiNotFoundResponse({ description: '쪽지를 찾을 수 없음' })
    @ApiUnauthorizedResponse({ description: '인증 필요' })
    @ApiHeader({
        name: 'Cookie',
        description: '로그인 세션 쿠키',
        required: true
    })
    @Patch(':id/read')
    async markAsRead(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<BaseResponse> {
        try {
            const user = req.user as User;
            await this.messagesService.markAsRead(id, user.id);
            return { success: true };
        } catch (error: any) {
            this.logger.error(`쪽지 읽음 상태 변경 실패: ${error.message}`);
            throw error;
        }
    }
}
