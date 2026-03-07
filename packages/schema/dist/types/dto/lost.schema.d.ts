import { z } from 'zod';
export declare const LostDtoSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    category: string;
    time: string;
    location: string;
}, {
    description: string;
    title: string;
    category: string;
    time: string;
    location: string;
}>;
export type LostDto = z.infer<typeof LostDtoSchema>;
