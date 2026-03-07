import { z } from 'zod';
import { UserSchema } from '../vo';
export const LoginDtoSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const LoginBackDtoSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type LoginBackDto = z.infer<typeof LoginBackDtoSchema>;

export const RegisterDtoSchema = z
  .object({
    name: z.string().min(1, '用户名不能为空'),
    email: z.string().email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string().min(6, '确认密码至少6位'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
