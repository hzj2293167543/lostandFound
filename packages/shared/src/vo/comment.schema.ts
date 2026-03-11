import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  time: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
  }),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
  itemId: z.number().positive('物品ID必须为正数'),
  itemType: z.number().min(0).max(1),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;
