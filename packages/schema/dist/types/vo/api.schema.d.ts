import { z } from 'zod';
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: T;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: T;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: T;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};
export declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodNull;
}, "strip", z.ZodTypeAny, {
    code: number;
    message: string;
    data: null;
}, {
    code: number;
    message: string;
    data: null;
}>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    token: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodString;
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role: string;
    }, {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role: string;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role: string;
    };
    token: string;
}, {
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role: string;
    };
    token: string;
}>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
