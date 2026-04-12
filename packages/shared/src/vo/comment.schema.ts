import { z } from 'zod';
export const CommentItemSchema = z.object({
  id: z.number().int().nonnegative(),
  parentId: z.number().int().nonnegative().nullable(),
  rootId: z.number().int().nonnegative().nullable(),
  replyUser: z
    .object({
      id: z.number().int().nonnegative(),
      name: z.string(),
      avatar: z.string().optional(),
    })
    .nullable(),
  parent: z
    .object({
      id: z.coerce.number(),
      content: z.string(),
      user: z.object({
        id: z.coerce.number(),
        name: z.string(),
        avatar: z.string().optional(),
      }),
    })
    .nullable()
    .optional(),
  content: z.string(),
  time: z.string(),
  user: z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  isLiked: z.boolean(),
  likeCount: z.number().int().nonnegative(),
  childrenCount: z.number().int().nonnegative().default(0),
});
export type CommentItem = z.infer<typeof CommentItemSchema>;

export const CommentSchema: z.ZodType<{
  id: number;
  parentId: number | null;
  rootId: number | null;
  replyUser: { id: number; name: string; avatar?: string | undefined } | null;
  content: string;
  time: string;
  user: { id: number; name: string; avatar?: string | undefined };
  children: Comment[];
  isLiked: boolean;
  likeCount: number;
  childrenCount: number;
}> = z.object({
  ...CommentItemSchema.shape,
  children: z.lazy(() => z.array(CommentSchema)),
});

export type Comment = z.infer<typeof CommentSchema>;
