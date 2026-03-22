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

export const FoundUpdateDtoSchema = FoundCreateDtoSchema.extend({
  id: z.number().min(1, 'ID不能为空'),
  status: z.number().min(0, '状态不能为空'),
});

export interface FoundUpdateDto extends z.infer<typeof FoundUpdateDtoSchema> {}

export const GetFoundItemsParamsSchema = z.object({
  page: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().nonnegative().optional(),
  categoryId: z.coerce.number().optional(),
  status: z.coerce.number().optional(),
  search: z.string().optional(),
  userId: z.coerce.number().optional(),
});
export type GetFoundItemsParams = z.infer<typeof GetFoundItemsParamsSchema>;
