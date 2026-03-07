import { z } from 'zod';
export declare const FoundItemSchema: z.ZodObject<{
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
    time: z.ZodString;
    storageLocation: z.ZodString;
    contactPhone: z.ZodString;
    status: z.ZodNumber;
    description: z.ZodString;
    location: z.ZodString;
    image: z.ZodString;
    user: z.ZodOptional<z.ZodObject<{
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
    }>>;
    commentCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: number;
    status: number;
    description: string;
    time: string;
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    storageLocation: string;
    contactPhone: string;
    user?: {
        id: number;
        name: string;
        avatar: string;
    } | undefined;
    commentCount?: number | undefined;
}, {
    id: number;
    status: number;
    description: string;
    time: string;
    title: string;
    category: {
        id: number;
        name: string;
    };
    location: string;
    image: string;
    storageLocation: string;
    contactPhone: string;
    user?: {
        id: number;
        name: string;
        avatar: string;
    } | undefined;
    commentCount?: number | undefined;
}>;
export type FoundItem = z.infer<typeof FoundItemSchema>;
export declare const FoundDetailSchema: z.ZodObject<{
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
    time: z.ZodString;
    storageLocation: z.ZodString;
    contactPhone: z.ZodString;
    status: z.ZodNumber;
    description: z.ZodString;
    location: z.ZodString;
    image: z.ZodString;
    commentCount: z.ZodOptional<z.ZodNumber>;
} & {
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
    storageLocation: string;
    contactPhone: string;
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
    storageLocation: string;
    contactPhone: string;
    commentCount?: number | undefined;
}>;
export type FoundDetail = z.infer<typeof FoundDetailSchema>;
export declare const CreateFoundItemSchema: z.ZodObject<{
    title: z.ZodString;
    categoryId: z.ZodNumber;
    description: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
    storageLocation: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    time: string;
    title: string;
    location: string;
    categoryId: number;
    image?: string | undefined;
    storageLocation?: string | undefined;
    contactPhone?: string | undefined;
}, {
    description: string;
    time: string;
    title: string;
    location: string;
    categoryId: number;
    image?: string | undefined;
    storageLocation?: string | undefined;
    contactPhone?: string | undefined;
}>;
export type CreateFoundItem = z.infer<typeof CreateFoundItemSchema>;
export declare const UpdateFoundItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    storageLocation: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contactPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    time?: string | undefined;
    title?: string | undefined;
    location?: string | undefined;
    image?: string | undefined;
    categoryId?: number | undefined;
    storageLocation?: string | undefined;
    contactPhone?: string | undefined;
}, {
    description?: string | undefined;
    time?: string | undefined;
    title?: string | undefined;
    location?: string | undefined;
    image?: string | undefined;
    categoryId?: number | undefined;
    storageLocation?: string | undefined;
    contactPhone?: string | undefined;
}>;
export type UpdateFoundItem = z.infer<typeof UpdateFoundItemSchema>;
