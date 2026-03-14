import { z } from 'zod';
export const CommentItemSchema = z.object({
  id: z.number().int().nonnegative(),
  parentId: z.number().int().nonnegative(),
  replyUser: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string(),
      avatar: z.string().url().optional(),
    })
    .nullable(),
  content: z.string(),
  time: z.string(),
  user: z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    avatar: z.string().url().optional(),
  }),
  isLiked: z.boolean(),
  likeCount: z.number().int().nonnegative(),
});
export type CommentItem = z.infer<typeof CommentItemSchema>;

export const CommentSchema: z.ZodType<{
  id: number;
  parentId: number | null;
  replyUser: { id: number; name: string; avatar?: string | undefined } | null;
  content: string;
  time: string;
  user: { id: number; name: string; avatar?: string | undefined };
  children: Comment[];
  isLiked: boolean;
  likeCount: number;
}> = z.object({
  ...CommentItemSchema.shape,
  children: z.lazy(() => z.array(CommentSchema)),
});

export type Comment = z.infer<typeof CommentSchema>;
