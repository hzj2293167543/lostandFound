import z from 'zod';
export const commentDtoSchema = z.object({
  id: z.number().int().nonnegative(),
  parentId: z.number().int().nonnegative(),
  itemId: z.number().int().nonnegative(),
  itemType: z.number().int().nonnegative(),
  user: z.object({
    id: z.number().int().nonnegative(),
    avatar: z.string().optional(),
    name: z.string().min(1),
  }),
  content: z.string().min(1),
  time: z.string().datetime(),
});
export type CommentDto = z.infer<typeof commentDtoSchema>;

export const commentsDtoSchema = z.array(commentDtoSchema);
export type CommentsDto = z.infer<typeof commentsDtoSchema>;

export const commentCreateDtoSchema = z.object({
  parentId: z.number().int().nonnegative().nullable(),
  itemId: z.number().int().nonnegative(),
  itemType: z.number().int().nonnegative(),
  content: z.string().min(1),
});
export type CommentCreateDto = z.infer<typeof commentCreateDtoSchema>;
