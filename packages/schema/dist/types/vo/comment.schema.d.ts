import { z } from 'zod';
export declare const CommentSchema: z.ZodObject<{
    id: z.ZodNumber;
    content: z.ZodString;
    time: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        avatar: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        avatar: string;
    }, {
        id: number;
        name: string;
        avatar: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: number;
    content: string;
    time: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
}, {
    id: number;
    content: string;
    time: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
}>;
export type Comment = z.infer<typeof CommentSchema>;
export declare const CreateCommentSchema: z.ZodObject<{
    content: z.ZodString;
    itemId: z.ZodNumber;
    itemType: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    content: string;
    itemId: number;
    itemType: number;
}, {
    content: string;
    itemId: number;
    itemType: number;
}>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
