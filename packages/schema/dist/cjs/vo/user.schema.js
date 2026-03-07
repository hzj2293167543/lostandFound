"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    contact: zod_1.z.string(),
    status: zod_1.z.number(),
    description: zod_1.z.string(),
    avatar: zod_1.z.string(),
    role: zod_1.z.number(),
});
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, '用户名不能为空'),
    password: zod_1.z.string().min(6, '密码至少6位'),
});
exports.RegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, '用户名不能为空'),
    email: zod_1.z.string().email('邮箱格式不正确'),
    password: zod_1.z.string().min(6, '密码至少6位'),
});
