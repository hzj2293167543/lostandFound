import { z } from 'zod';
export const LostDtoSchema = z.object({
    title: z.string().min(1, '标题不能为空'),
    category: z.string().min(1, '分类不能为空'),
    description: z.string().min(1, '描述不能为空'),
    time: z.string().min(1, '丢失时间不能为空'),
    location: z.string().min(1, '丢失地点不能为空'),
});
