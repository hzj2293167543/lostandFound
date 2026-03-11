import z from 'zod';
export const FoundCreateDtoSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  category: z.number().min(1, '分类不能为空'),
  description: z.string().min(1, '描述不能为空'),
  time: z.string().min(1, '捡到时间不能为空'),
  location: z.string().min(1, '捡到地点不能为空'),
  storageLocation: z.string().min(1, '存储地点不能为空'),
  contactPhone: z.string().optional(),
  image: z.string().optional(),
});

export interface FoundCreateDto extends z.infer<typeof FoundCreateDtoSchema> {}
