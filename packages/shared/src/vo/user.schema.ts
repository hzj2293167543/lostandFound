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

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少6位'),
});

export type Login = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
});

export type Register = z.infer<typeof RegisterSchema>;

export interface FoundEditFormData {
  id: number;
  title: string;
  category: number;
  time: string;
  storage_location: string;
  contact_phone: string;
  status: number;
  description: string;
  location: string;
  image: string;
  imageFile?: File;
}

export type UnwrappedResponse<T> = T extends { data: infer D } ? D : never;
