"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnnouncementSchema = exports.CreateAnnouncementSchema = exports.AnnouncementDetailSchema = exports.AnnouncementSchema = void 0;
const zod_1 = require("zod");
exports.AnnouncementSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    time: zod_1.z.string(),
    author: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
    }),
});
exports.AnnouncementDetailSchema = exports.AnnouncementSchema.extend({
    author: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string(),
        description: zod_1.z.string(),
        contact: zod_1.z.string(),
    }),
});
exports.CreateAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, '标题不能为空').max(255, '标题最多255个字符'),
    content: zod_1.z.string().min(1, '内容不能为空'),
});
exports.UpdateAnnouncementSchema = exports.CreateAnnouncementSchema.partial();
