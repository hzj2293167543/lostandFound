import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationTypeValue } from './entities/notification.entity';

interface CreateNotificationData {
  userId: number;
  type: NotificationTypeValue;
  message: string;
  targetId?: number;
  targetType?: string;
  relatedUserId?: number;
  relatedUserName?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  create(data: CreateNotificationData): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: data.userId,
      type: data.type,
      message: data.message,
      targetId: data.targetId ?? null,
      targetType: data.targetType ?? null,
      relatedUserId: data.relatedUserId ?? null,
      relatedUserName: data.relatedUserName ?? null,
      readStatus: 0,
    });
    return this.notificationRepository.save(notification);
  }

  findByUserId(userId: number, options?: { unreadOnly?: boolean }): Promise<Notification[]> {
    const where = { userId };
    if (options?.unreadOnly) {
      where['readStatus'] = 0;
    }
    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.notificationRepository.update({ id, userId }, { readStatus: 1, readAt: new Date() });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, readStatus: 0 },
      { readStatus: 1, readAt: new Date() }
    );
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.notificationRepository.softDelete({ id, userId });
  }

  async deleteAll(userId: number): Promise<void> {
    await this.notificationRepository.softDelete({ userId });
  }

  getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, readStatus: 0 },
    });
  }
}
