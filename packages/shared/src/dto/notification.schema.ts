import { z } from 'zod';

export const NotificationType = {
  Like: 1,
  Comment: 2,
  Report: 3,
} as const;

export type NotificationTypeValue = (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationSchema = z.object({
  id: z.coerce.number(),
  userId: z.coerce.number(),
  type: z.coerce.number().int().min(1).max(3),
  message: z.string().max(500),
  targetId: z.coerce.number().nullable(),
  targetType: z.string().nullable(),
  relatedUserId: z.coerce.number().nullable(),
  relatedUserName: z.string().nullable(),
  readStatus: z.coerce.number(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationListSchema = z.array(NotificationSchema);

export type NotificationList = z.infer<typeof NotificationListSchema>;
