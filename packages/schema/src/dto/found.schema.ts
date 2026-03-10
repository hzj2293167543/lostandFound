import z from 'zod';
export const FoundCreateDtoSchema = z.object({
  name: z.string().min(1, '物品名称不能为空'),
  type: z.number().int().min(0, '物品类型必须是整数').max(1, '物品类型必须是0或1'),
  description: z.string().min(1, '物品描述不能为空'),
});
