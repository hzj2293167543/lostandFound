import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称最多50个字符'),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
