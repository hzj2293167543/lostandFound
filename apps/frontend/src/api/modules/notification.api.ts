import type { Notification } from '@lostfound/shared';
import { NotificationListSchema } from '@lostfound/shared';
import { get, patch, remove } from '../client';

export const notificationApi = {
  getNotifications: () =>
    get<Notification[]>('/notifications').then((data) => {
      return NotificationListSchema.parse(data);
    }),

  markAsRead: (id: number) => patch<void>(`/notifications/${id}/read`),

  markAllAsRead: () => patch<void>('/notifications/read-all'),

  deleteNotification: (id: number) => remove<void>(`/notifications/${id}`),

  deleteAll: () => remove<void>('/notifications'),
};

export default notificationApi;
