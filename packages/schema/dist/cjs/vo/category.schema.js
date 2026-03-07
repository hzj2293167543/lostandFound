"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategorySchema = exports.CategorySchema = void 0;
const zod_1 = require("zod");
exports.CategorySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, '分类名称不能为空').max(50, '分类名称最多50个字符'),
});
