import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { NotificationsService } from './notifications.service';
import { User } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@GetUser() user: User) {
    return this.notificationsService.getNotifications(user.id);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string, @GetUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Get('settings')
  getSettings(@GetUser() user: User) {
    return this.notificationsService.getSettings(user.id);
  }

  @Put('settings')
  updateSettings(@GetUser() user: User, @Body() settings: any) {
    return this.notificationsService.updateSettings(user.id, settings);
  }
}
