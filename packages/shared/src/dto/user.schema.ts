import z from 'zod';

export const UserEditDtoSchema = z
  .object({
    name: z.string().min(3).max(20).optional(),
    avatar: z.string().url().optional(),
    email: z.string().email().optional(),
    contact: z.string().min(3).max(20).optional(),
    description: z.string().min(3).max(200).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: '请至少修改一个值',
  });

export type UserEditDto = z.infer<typeof UserEditDtoSchema>;
