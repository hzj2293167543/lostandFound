import { z } from 'zod';
export declare const LoginDtoSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginDto = z.infer<typeof LoginDtoSchema>;
export declare const LoginBackDtoSchema: z.ZodObject<{
    token: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        email: z.ZodString;
        contact: z.ZodString;
        status: z.ZodNumber;
        description: z.ZodString;
        avatar: z.ZodString;
        role: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        email: string;
        status: number;
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
        role: number;
    }, {
        email: string;
        status: number;
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
        role: number;
    }>;
}, "strip", z.ZodTypeAny, {
    token: string;
    user: {
        email: string;
        status: number;
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
        role: number;
    };
}, {
    token: string;
    user: {
        email: string;
        status: number;
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
        role: number;
    };
}>;
export type LoginBackDto = z.infer<typeof LoginBackDtoSchema>;
export declare const RegisterDtoSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}>, {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
