import { z } from 'zod';
export declare const AnnouncementSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    content: z.ZodString;
    time: z.ZodString;
    author: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: number;
    content: string;
    time: string;
    title: string;
    author: {
        id: number;
        name: string;
    };
}, {
    id: number;
    content: string;
    time: string;
    title: string;
    author: {
        id: number;
        name: string;
    };
}>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export declare const AnnouncementDetailSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    content: z.ZodString;
    time: z.ZodString;
} & {
    author: z.ZodObject<{
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
    content: string;
    time: string;
    title: string;
    author: {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    };
}, {
    id: number;
    content: string;
    time: string;
    title: string;
    author: {
        id: number;
        name: string;
        contact: string;
        description: string;
        avatar: string;
    };
}>;
export type AnnouncementDetail = z.infer<typeof AnnouncementDetailSchema>;
export declare const CreateAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    title: string;
}, {
    content: string;
    title: string;
}>;
export type CreateAnnouncement = z.infer<typeof CreateAnnouncementSchema>;
export declare const UpdateAnnouncementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    title?: string | undefined;
}, {
    content?: string | undefined;
    title?: string | undefined;
}>;
export type UpdateAnnouncement = z.infer<typeof UpdateAnnouncementSchema>;
