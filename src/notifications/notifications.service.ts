import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getNotifications(userId: string) {
    return this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    if (notification.user.id !== userId) {
      throw new UnauthorizedException('이 알림에 대한 권한이 없습니다.');
    }

    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async getSettings(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      email: {
        newMessage: true,
        newFollower: true,
        postComment: true,
        postLike: false,
        newsletter: true,
      },
      push: {
        newMessage: true,
        newFollower: false,
        postComment: true,
        postLike: true,
      },
    };
  }

  async updateSettings(userId: string, settings: any) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // TODO: 실제 설정 저장 로직 구현
    return settings;
  }

  async createNotification(data: {
    type: string;
    title: string;
    message: string;
    user: User;
    relatedId?: string;
  }): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    return this.notificationsRepository.save(notification);
  }
}
