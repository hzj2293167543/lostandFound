import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema,
  });

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const ApiErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.null(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    role: z.string(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
