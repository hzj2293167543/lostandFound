"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFoundItemSchema = exports.CreateFoundItemSchema = exports.FoundDetailSchema = exports.FoundItemSchema = void 0;
const zod_1 = require("zod");
const category_schema_1 = require("./category.schema");
const comment_schema_1 = require("./comment.schema");
exports.FoundItemSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    category: category_schema_1.CategorySchema,
    time: zod_1.z.string(),
    storageLocation: zod_1.z.string(),
    contactPhone: zod_1.z.string(),
    status: zod_1.z.number(),
    description: zod_1.z.string(),
    location: zod_1.z.string(),
    image: zod_1.z.string(),
    user: zod_1.z
        .object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string(),
    })
        .optional(),
    commentCount: zod_1.z.number().optional(),
});
exports.FoundDetailSchema = exports.FoundItemSchema.extend({
    user: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        avatar: zod_1.z.string(),
        description: zod_1.z.string(),
        contact: zod_1.z.string(),
    }),
    comments: zod_1.z.array(comment_schema_1.CommentSchema),
});
exports.CreateFoundItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, '标题不能为空').max(255, '标题最多255个字符'),
    categoryId: zod_1.z.number().positive('分类ID必须为正数'),
    description: zod_1.z.string().min(1, '描述不能为空'),
    time: zod_1.z.string(),
    location: zod_1.z.string().min(1, '捡到地点不能为空'),
    storageLocation: zod_1.z.string().optional(),
    contactPhone: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
});
exports.UpdateFoundItemSchema = exports.CreateFoundItemSchema.partial();
