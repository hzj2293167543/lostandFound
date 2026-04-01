import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { SkipBan } from '@/common/decorators/skipBan.decorator';
import { User } from '@lostfound/shared';
import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@SkipBan()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.notificationService.findByUserId(user.id);
  }

  @Patch(':id/read')
  markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notificationService.markAsRead(+id, user.id);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationService.markAllAsRead(user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationService.delete(+id, user.id);
  }

  @Delete()
  deleteAll(@CurrentUser() user: User) {
    return this.notificationService.deleteAll(user.id);
  }
}
