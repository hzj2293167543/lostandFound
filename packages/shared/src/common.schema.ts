import z from 'zod';

export const PasswordSchema = z.string().min(6, '密码至少6位');
export type Password = z.infer<typeof PasswordSchema>;

export const PageResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  });

export type PageResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const GetLostItemsParamsSchema = z.object({
  page: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().nonnegative().optional(),
  categoryId: z.coerce.number().optional(),
  status: z.coerce.number().optional(),
  search: z.string().optional(),
});

export type GetLostItemsParams = z.infer<typeof GetLostItemsParamsSchema>;
