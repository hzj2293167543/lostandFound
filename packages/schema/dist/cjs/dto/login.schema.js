"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDtoSchema = exports.LoginBackDtoSchema = exports.LoginDtoSchema = void 0;
const zod_1 = require("zod");
const vo_1 = require("../vo");
exports.LoginDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email('邮箱格式不正确'),
    password: zod_1.z.string().min(6, '密码至少6位'),
});
exports.LoginBackDtoSchema = zod_1.z.object({
    token: zod_1.z.string(),
    user: vo_1.UserSchema,
});
exports.RegisterDtoSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1, '用户名不能为空'),
    email: zod_1.z.string().email('邮箱格式不正确'),
    password: zod_1.z.string().min(6, '密码至少6位'),
    confirmPassword: zod_1.z.string().min(6, '确认密码至少6位'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
});
