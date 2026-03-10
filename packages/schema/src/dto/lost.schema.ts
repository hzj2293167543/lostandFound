import { z } from 'zod';

export const LostCreateDtoSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  category: z.number().min(1, '分类不能为空'),
  description: z.string().min(1, '描述不能为空'),
  time: z.string().min(1, '丢失时间不能为空'),
  location: z.string().min(1, '丢失地点不能为空'),
  // image: z.string().url('图片链接无效').optional(),
  image: z.string().optional(),
});

export interface LostCreateDto extends z.infer<typeof LostCreateDtoSchema> {}
