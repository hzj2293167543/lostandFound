import { z } from 'zod';
import { CategorySchema } from './category.schema';
import { CommentSchema } from './comment.schema';

export const LostItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: CategorySchema,
  description: z.string(),
  time: z.string(),
  location: z.string(),
  status: z.number(),
  image: z.string(),
  commentCount: z.number().optional(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
  }),
});

export type LostItem = z.infer<typeof LostItemSchema>;

export const LostDetailSchema = LostItemSchema.extend({
  comments: z.array(CommentSchema),
  user: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
    description: z.string(),
    contact: z.string(),
  }),
});

export type LostDetail = z.infer<typeof LostDetailSchema>;

export const CreateLostItemSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(255, '标题最多255个字符'),
  categoryId: z.number().positive('分类ID必须为正数'),
  description: z.string().min(1, '描述不能为空'),
  time: z.string(),
  location: z.string().min(1, '丢失地点不能为空'),
  image: z.string().optional(),
});

export type CreateLostItem = z.infer<typeof CreateLostItemSchema>;

export const UpdateLostItemSchema = CreateLostItemSchema.partial();

export type UpdateLostItem = z.infer<typeof UpdateLostItemSchema>;
