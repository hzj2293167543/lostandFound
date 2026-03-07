"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostDtoSchema = void 0;
const zod_1 = require("zod");
exports.LostDtoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, '标题不能为空'),
    category: zod_1.z.string().min(1, '分类不能为空'),
    description: zod_1.z.string().min(1, '描述不能为空'),
    time: zod_1.z.string().min(1, '丢失时间不能为空'),
    location: zod_1.z.string().min(1, '丢失地点不能为空'),
});
