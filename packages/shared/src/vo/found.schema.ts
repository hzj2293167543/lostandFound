import { z } from 'zod';
import { CategorySchema } from './category.schema';
import { CommentSchema } from './comment.schema';

export const FoundItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: CategorySchema,
  time: z.string(),
  storageLocation: z.string(),
  contactPhone: z.string(),
  status: z.number(),
  description: z.string(),
  location: z.string(),
  image: z.string(),
  user: z
    .object({
      id: z.number(),
      name: z.string(),
      avatar: z.string(),
    })
    .optional(),
  commentCount: z.number().optional(),
});

export type FoundItem = z.infer<typeof FoundItemSchema>;

export const FoundDetailSchema = FoundItemSchema.extend({
  user: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
    description: z.string(),
    contact: z.string(),
  }),
  comments: z.array(CommentSchema),
});

export type FoundDetail = z.infer<typeof FoundDetailSchema>;

export const CreateFoundItemSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(255, '标题最多255个字符'),
  categoryId: z.number().positive('分类ID必须为正数'),
  description: z.string().min(1, '描述不能为空'),
  time: z.string(),
  location: z.string().min(1, '捡到地点不能为空'),
  storageLocation: z.string().optional(),
  contactPhone: z.string().optional(),
  image: z.string().optional(),
});

export type CreateFoundItem = z.infer<typeof CreateFoundItemSchema>;

export const UpdateFoundItemSchema = CreateFoundItemSchema.partial();

export type UpdateFoundItem = z.infer<typeof UpdateFoundItemSchema>;
