import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  async create(
    @Body() createInquiryDto: CreateInquiryDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    const inquiry = await this.inquiriesService.create(
      createInquiryDto,
      files,
      user,
    );
    return {
      success: true,
      data: inquiry,
    };
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('filter') filter?: 'all' | 'answered' | 'pending',
    @Query('sort') sort?: 'latest' | 'oldest' | 'answered' | 'pending',
  ) {
    const data = await this.inquiriesService.findAll(
      page,
      limit,
      search,
      filter,
      sort,
    );
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const inquiry = await this.inquiriesService.findOne(id);
    return {
      success: true,
      data: inquiry,
    };
  }

  @Patch(':id/answer')
  @UseGuards(JwtAuthGuard)
  async answer(
    @Param('id') id: string,
    @Body() updateInquiryDto: UpdateInquiryDto,
  ) {
    const inquiry = await this.inquiriesService.answer(id, updateInquiryDto);
    return {
      success: true,
      data: inquiry,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.inquiriesService.remove(id);
    return {
      success: true,
    };
  }

  @Get('attachments/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', fileName);
    return res.download(filePath);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const comment = await this.inquiriesService.addComment(
      id,
      createCommentDto,
      user,
    );
    return {
      success: true,
      data: comment,
    };
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @GetUser() user: User,
  ) {
    const comment = await this.inquiriesService.updateComment(
      id,
      content,
      user.id,
    );
    return {
      success: true,
      data: comment,
    };
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string, @GetUser() user: User) {
    await this.inquiriesService.deleteComment(id, user.id);
    return {
      success: true,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateInquiryDto: UpdateInquiryDto,
    @GetUser() user: User,
  ) {
    const inquiry = await this.inquiriesService.update(
      id,
      updateInquiryDto,
      user.id,
    );
    return {
      success: true,
      data: inquiry,
    };
  }

  @Delete(':id/attachments/:attachmentId')
  @UseGuards(JwtAuthGuard)
  async deleteAttachment(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @GetUser() user: User,
  ) {
    await this.inquiriesService.deleteAttachment(id, attachmentId, user.id);
    return {
      success: true,
    };
  }
}
