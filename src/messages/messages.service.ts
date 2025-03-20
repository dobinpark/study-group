import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../user/entities/user.entity';
import { StudyGroup } from '../study/entities/study-group.entity';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StudyGroup)
    private readonly studyGroupRepository: Repository<StudyGroup>,
  ) {}


  // 쪽지 보내기
  async sendMessage(createMessageDto: CreateMessageDto, senderId: number): Promise<Message> {
    try {
      // 받는 사람 확인
      const receiver = await this.userRepository.findOne({ where: { id: createMessageDto.receiverId } });
      if (!receiver) {
        throw new NotFoundException('받는 사람을 찾을 수 없습니다.');
      }

      // 스터디 그룹 ID가 있는 경우, 스터디 그룹 확인
      if (createMessageDto.studyGroupId) {
        const studyGroup = await this.studyGroupRepository.findOne({
          where: { id: createMessageDto.studyGroupId },
          relations: ['creator', 'members']
        });

        if (!studyGroup) {
          throw new NotFoundException('스터디 그룹을 찾을 수 없습니다.');
        }

        // 보내는 사람이 스터디 방장인지 확인 (방장만 스터디 그룹 관련 쪽지 발송 가능)
        if (studyGroup.creator.id !== senderId) {
          throw new ForbiddenException('스터디 그룹 관련 쪽지는 방장만 보낼 수 있습니다.');
        }

        // 받는 사람이 스터디 멤버인지 확인
        const isMember = studyGroup.members.some(member => member.id === createMessageDto.receiverId);
        if (!isMember) {
          throw new BadRequestException('받는 사람이 해당 스터디 그룹의 멤버가 아닙니다.');
        }
      }

      // 쪽지 생성
      const message = this.messageRepository.create({
        ...createMessageDto,
        senderId,
        isRead: false
      });

      return await this.messageRepository.save(message);
    } catch (error: any) {
      this.logger.error(`쪽지 보내기 오류: ${error.message}`, error.stack);
      throw error;
    }
  }


  // 받은 쪽지 목록 조회
  async getReceivedMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverId: userId },
      order: { createdAt: 'DESC' }
    });
  }


  // 보낸 쪽지 목록 조회
  async getSentMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { senderId: userId },
      order: { createdAt: 'DESC' }
    });
  }


  // 쪽지 상세 조회
  async getMessageById(id: number, userId: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id }
    });

    if (!message) {
      throw new NotFoundException('쪽지를 찾을 수 없습니다.');
    }

    // 본인이 보냈거나 받은 쪽지만 조회 가능
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('해당 쪽지에 접근할 권한이 없습니다.');
    }

    // 받은 쪽지인 경우 읽음 처리
    if (message.receiverId === userId && !message.isRead) {
      message.isRead = true;
      await this.messageRepository.save(message);
    }

    return message;
  }


  // 쪽지 삭제
  async deleteMessage(id: number, userId: number): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id }
    });

    if (!message) {
      throw new NotFoundException('쪽지를 찾을 수 없습니다.');
    }

    // 본인이 보냈거나 받은 쪽지만 삭제 가능
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('해당 쪽지를 삭제할 권한이 없습니다.');
    }

    await this.messageRepository.remove(message);
  }


  // 읽지 않은 쪽지 개수 조회
  async getUnreadCount(userId: number): Promise<number> {
    return this.messageRepository.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
  }

  // 쪽지 읽음 상태로 변경
  async markAsRead(id: number, userId: number): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id }
    });

    if (!message) {
      throw new NotFoundException('쪽지를 찾을 수 없습니다.');
    }

    // 받은 쪽지만 읽음 상태로 변경 가능
    if (message.receiverId !== userId) {
      throw new ForbiddenException('해당 쪽지를 읽음 처리할 권한이 없습니다.');
    }

    // 이미 읽음 상태이면 아무 것도 하지 않음
    if (message.isRead) {
      return;
    }

    // 읽음 상태로 변경
    message.isRead = true;
    await this.messageRepository.save(message);
  }
}
