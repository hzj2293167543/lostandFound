import z from 'zod';

export const AnnouncementCreateDtoSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.coerce.number(),
});
export type AnnouncementCreateDto = z.infer<typeof AnnouncementCreateDtoSchema>;

export const AnnouncementEditDtoSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.coerce.number(),
});
export type AnnouncementEditDto = z.infer<typeof AnnouncementEditDtoSchema>;
