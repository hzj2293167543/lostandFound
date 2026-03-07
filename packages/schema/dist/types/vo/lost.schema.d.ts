import { z } from 'zod';
export declare const LostItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    category: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
    description: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
    status: z.ZodNumber;
    image: z.ZodString;
    commentCount: z.ZodOptional<z.ZodNumber>;
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
    status: number;
    description: string;
    time: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    commentCount?: number | undefined;
}, {
    id: number;
    status: number;
    description: string;
    time: string;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    commentCount?: number | undefined;
}>;
export type LostItem = z.infer<typeof LostItemSchema>;
export declare const LostDetailSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    category: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
    description: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
    status: z.ZodNumber;
    image: z.ZodString;
    commentCount: z.ZodOptional<z.ZodNumber>;
} & {
    comments: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    user: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        avatar: z.ZodString;
        description: z.ZodString;
        contact: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    }, {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: number;
    status: number;
    description: string;
    time: string;
    user: {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    };
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    comments: {
        id: number;
        content: string;
        time: string;
        user: {
            id: number;
            name: string;
            avatar: string;
        };
    }[];
    commentCount?: number | undefined;
}, {
    id: number;
    status: number;
    description: string;
    time: string;
    user: {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    };
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    comments: {
        id: number;
        content: string;
        time: string;
        user: {
            id: number;
            name: string;
            avatar: string;
        };
    }[];
    commentCount?: number | undefined;
}>;
export type LostDetail = z.infer<typeof LostDetailSchema>;
export declare const CreateLostItemSchema: z.ZodObject<{
    title: z.ZodString;
    categoryId: z.ZodNumber;
    description: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    time: string;
    title: string;
    location: string;
    categoryId: number;
    image?: string | undefined;
}, {
    description: string;
    time: string;
    title: string;
    location: string;
    categoryId: number;
    image?: string | undefined;
}>;
export type CreateLostItem = z.infer<typeof CreateLostItemSchema>;
export declare const UpdateLostItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    time?: string | undefined;
    title?: string | undefined;
    location?: string | undefined;
    image?: string | undefined;
    categoryId?: number | undefined;
}, {
    description?: string | undefined;
    time?: string | undefined;
    title?: string | undefined;
    location?: string | undefined;
    image?: string | undefined;
    categoryId?: number | undefined;
}>;
export type UpdateLostItem = z.infer<typeof UpdateLostItemSchema>;
