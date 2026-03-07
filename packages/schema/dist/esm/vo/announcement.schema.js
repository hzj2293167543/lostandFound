import { z } from 'zod';
export const AnnouncementSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    time: z.string(),
    author: z.object({
        id: z.number(),
        name: z.string(),
    }),
});
export const AnnouncementDetailSchema = AnnouncementSchema.extend({
    author: z.object({
        id: z.number(),
        name: z.string(),
        avatar: z.string(),
        description: z.string(),
        contact: z.string(),
    }),
});
export const CreateAnnouncementSchema = z.object({
    title: z.string().min(1, '标题不能为空').max(255, '标题最多255个字符'),
    content: z.string().min(1, '内容不能为空'),
});
export const UpdateAnnouncementSchema = CreateAnnouncementSchema.partial();
