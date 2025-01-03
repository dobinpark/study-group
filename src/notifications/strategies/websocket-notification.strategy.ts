import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class WebSocketNotificationStrategy implements NotificationStrategy {
  async send(notification: Notification): Promise<void> {
    // 웹소켓 전송 로직 구현
    console.log(`웹소켓 발송: ${notification.user.id}`);
    console.log(`메시지: ${notification.title} - ${notification.message}`);
  }
}
