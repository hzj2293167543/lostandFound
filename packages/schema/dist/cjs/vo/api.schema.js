"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseSchema = exports.ApiErrorSchema = exports.ApiResponseSchema = void 0;
const zod_1 = require("zod");
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    code: zod_1.z.number(),
    message: zod_1.z.string(),
    data: dataSchema,
});
exports.ApiResponseSchema = ApiResponseSchema;
exports.ApiErrorSchema = zod_1.z.object({
    code: zod_1.z.number(),
    message: zod_1.z.string(),
    data: zod_1.z.null(),
});
exports.AuthResponseSchema = zod_1.z.object({
    token: zod_1.z.string(),
    user: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        avatar: zod_1.z.string(),
        role: zod_1.z.string(),
    }),
});
