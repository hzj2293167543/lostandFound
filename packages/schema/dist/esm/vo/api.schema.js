import { z } from 'zod';
export const ApiResponseSchema = (dataSchema) => z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema,
});
export const ApiErrorSchema = z.object({
    code: z.number(),
    message: z.string(),
    data: z.null(),
});
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
