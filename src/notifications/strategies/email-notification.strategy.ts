import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationStrategy implements NotificationStrategy {
  constructor(private configService: ConfigService) {}

  async send(notification: Notification): Promise<void> {
    // 이메일 전송 로직 구현
    console.log(`이메일 발송: ${notification.user.email}`);
    console.log(`제목: ${notification.title}`);
    console.log(`내용: ${notification.message}`);
  }
}
