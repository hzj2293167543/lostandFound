import z from 'zod';

export const PasswordSchema = z.string().min(6, '密码至少6位');
export type Password = z.infer<typeof PasswordSchema>;
