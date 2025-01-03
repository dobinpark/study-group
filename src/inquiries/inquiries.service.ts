import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { User } from '../users/entities/user.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { Attachment } from './entities/attachment.entity';
import { FileUploadService } from '../common/services/file-upload.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiriesRepository: Repository<Inquiry>,
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private fileUploadService: FileUploadService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async uploadAttachments(
    inquiry: Inquiry,
    files: Express.Multer.File[],
  ): Promise<Attachment[]> {
    const attachments: Attachment[] = [];

    for (const file of files) {
      const fileName = await this.fileUploadService.saveFile(file);

      const attachment = this.attachmentsRepository.create({
        originalName: file.originalname,
        fileName,
        mimeType: file.mimetype,
        size: file.size,
        inquiry,
      });

      attachments.push(await this.attachmentsRepository.save(attachment));
    }

    return attachments;
  }

  async create(
    createInquiryDto: CreateInquiryDto,
    files: Express.Multer.File[],
    author: User,
  ): Promise<Inquiry> {
    const inquiry = this.inquiriesRepository.create({
      ...createInquiryDto,
      author,
    });

    const savedInquiry = await this.inquiriesRepository.save(inquiry);

    if (files?.length > 0) {
      await this.uploadAttachments(savedInquiry, files);
    }

    return this.findOne(savedInquiry.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: 'all' | 'answered' | 'pending',
    sort: 'latest' | 'oldest' | 'answered' | 'pending' = 'latest',
  ): Promise<{
    inquiries: Inquiry[];
    total: number;
    totalPages: number;
  }> {
    const queryBuilder = this.inquiriesRepository
      .createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.author', 'author')
      .leftJoinAndSelect('inquiry.attachments', 'attachments');

    if (search) {
      queryBuilder.andWhere(
        '(inquiry.title ILIKE :search OR inquiry.content ILIKE :search OR author.username ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (filter === 'answered') {
      queryBuilder.andWhere('inquiry.isAnswered = :isAnswered', {
        isAnswered: true,
      });
    } else if (filter === 'pending') {
      queryBuilder.andWhere('inquiry.isAnswered = :isAnswered', {
        isAnswered: false,
      });
    }

    switch (sort) {
      case 'oldest':
        queryBuilder.orderBy('inquiry.createdAt', 'ASC');
        break;
      case 'answered':
        queryBuilder
          .orderBy('inquiry.isAnswered', 'DESC')
          .addOrderBy('inquiry.createdAt', 'DESC');
        break;
      case 'pending':
        queryBuilder
          .orderBy('inquiry.isAnswered', 'ASC')
          .addOrderBy('inquiry.createdAt', 'DESC');
        break;
      default: // latest
        queryBuilder.orderBy('inquiry.createdAt', 'DESC');
    }

    const total = await queryBuilder.getCount();
    const inquiries = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      inquiries,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiriesRepository.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException('문의사항을 찾을 수 없습니다.');
    }
    return inquiry;
  }

  async answer(
    id: string,
    updateInquiryDto: UpdateInquiryDto,
  ): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    inquiry.answer = updateInquiryDto.answer;
    inquiry.isAnswered = true;

    // 답변 작성 시 작성자에게 알림 전송
    await this.notificationsService.createNotification({
      type: 'INQUIRY_ANSWERED',
      title: '문의사항 답변 완료',
      message: `문의하신 "${inquiry.title}" 글에 답변이 등록되었습니다.`,
      user: inquiry.author,
      relatedId: inquiry.id,
    });

    return this.inquiriesRepository.save(inquiry);
  }

  async remove(id: string): Promise<void> {
    const result = await this.inquiriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('문의사항을 찾을 수 없습니다.');
    }
  }

  async addComment(
    inquiryId: string,
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const inquiry = await this.findOne(inquiryId);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      inquiry,
      author,
    });

    const savedComment = await this.commentsRepository.save(comment);

    // 댓글 작성 시 문의사항 작성자에게 알림 전송
    if (inquiry.author.id !== author.id) {
      await this.notificationsService.createNotification({
        type: 'NEW_COMMENT',
        title: '새로운 댓글',
        message: `문의하신 "${inquiry.title}"에 새로운 댓글이 등록되었습니다.`,
        user: inquiry.author,
        relatedId: inquiry.id,
      });
    }

    return savedComment;
  }

  async updateComment(
    id: string,
    content: string,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('댓글을 수정할 권한이 없습니다.');
    }

    comment.content = content;
    return this.commentsRepository.save(comment);
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentsRepository.remove(comment);
  }

  async update(
    id: string,
    updateInquiryDto: UpdateInquiryDto,
    userId: string,
  ): Promise<Inquiry> {
    const inquiry = await this.findOne(id);

    if (inquiry.author.id !== userId) {
      throw new ForbiddenException('문의사항을 수정할 권한이 없습니다.');
    }

    if (inquiry.isAnswered) {
      throw new ForbiddenException(
        '이미 답변된 문의사항은 수정할 수 없습니다.',
      );
    }

    Object.assign(inquiry, updateInquiryDto);
    return this.inquiriesRepository.save(inquiry);
  }

  async deleteAttachment(
    inquiryId: string,
    attachmentId: string,
    userId: string,
  ): Promise<void> {
    const inquiry = await this.findOne(inquiryId);

    if (inquiry.author.id !== userId) {
      throw new ForbiddenException('첨부파일을 삭제할 권한이 없습니다.');
    }

    if (inquiry.isAnswered) {
      throw new ForbiddenException(
        '이미 답변된 문의사항의 첨부파일은 삭제할 수 없습니다.',
      );
    }

    const attachment = await this.attachmentsRepository.findOne({
      where: { id: attachmentId, inquiry: { id: inquiryId } },
    });

    if (!attachment) {
      throw new NotFoundException('첨부파일을 찾을 수 없습니다.');
    }

    await this.fileUploadService.deleteFile(attachment.fileName);
    await this.attachmentsRepository.remove(attachment);
  }
}
