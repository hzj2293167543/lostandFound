import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodString;
    contact: z.ZodString;
    status: z.ZodNumber;
    description: z.ZodString;
    avatar: z.ZodString;
    role: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    email: string;
    contact: string;
    status: number;
    description: string;
    avatar: string;
    role: number;
}, {
    id: number;
    name: string;
    email: string;
    contact: string;
    status: number;
    description: string;
    avatar: string;
    role: number;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const LoginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type Login = z.infer<typeof LoginSchema>;
export declare const RegisterSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
}, {
    email: string;
    username: string;
    password: string;
}>;
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
export type UnwrappedResponse<T> = T extends {
    data: infer D;
} ? D : never;
