import { ApiProperty } from '@nestjs/swagger';

export class NotificationType {
  @ApiProperty({ description: '알림 유형' })
  type: string;

  @ApiProperty({ description: '알림 메시지' })
  message: string;
}
