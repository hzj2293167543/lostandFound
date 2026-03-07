"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentSchema = exports.CommentSchema = void 0;
const zod_1 = require("zod");
exports.CommentSchema = zod_1.z.object({
    id: zod_1.z.number(),
    content: zod_1.z.string(),
    time: zod_1.z.string(),
    user: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string(),
    }),
});
exports.CreateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, '评论内容不能为空'),
    itemId: zod_1.z.number().positive('物品ID必须为正数'),
    itemType: zod_1.z.number().min(0).max(1),
});
