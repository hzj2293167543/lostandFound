import { z } from 'zod';

export const LostCreateDtoSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  category: z.number().min(1, '分类不能为空'),
  description: z.string().min(1, '描述不能为空'),
  time: z.string().min(1, '丢失时间不能为空'),
  location: z.string().min(1, '丢失地点不能为空'),
  image: z.string().url('图片链接无效').optional(),
});
export type LostCreateDto = z.infer<typeof LostCreateDtoSchema>;

export const LostUpdateDtoSchema = LostCreateDtoSchema.extend({
  id: z.number().min(1, 'ID不能为空'),
  status: z.number().min(0, '状态不能为空'),
});

export type LostUpdateDto = z.infer<typeof LostUpdateDtoSchema>;

export const GetLostItemsParamsSchema = z.object({
  page: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().nonnegative().optional(),
  categoryId: z.coerce.number().optional(),
  status: z.coerce.number().optional(),
  search: z.string().optional(),
});

export type GetLostItemsParams = z.infer<typeof GetLostItemsParamsSchema>;
