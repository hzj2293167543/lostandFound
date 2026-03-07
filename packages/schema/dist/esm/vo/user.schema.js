import { z } from 'zod';
export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    contact: z.string(),
    status: z.number(),
    description: z.string(),
    avatar: z.string(),
    role: z.number(),
});
export const LoginSchema = z.object({
    username: z.string().min(1, '用户名不能为空'),
    password: z.string().min(6, '密码至少6位'),
});
export const RegisterSchema = z.object({
    username: z.string().min(1, '用户名不能为空'),
    email: z.string().email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少6位'),
});
