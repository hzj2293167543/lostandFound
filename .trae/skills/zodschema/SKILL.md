---
name: writing-zod-schema
description:
  Triggered ONLY when defining Zod schemas for frontend forms (react-hook-form). Do NOT trigger when
  defining types for backend API responses.
---

# Zod Schema 表单约束

## 红线

- 严禁在表单 Schema 中直接使用 `z.number()` 处理表单输入字段。
- 原因：HTML 表单传递的值始终是 string 类型，直接用 `z.number()` 必定报错。

## 结构标准

处理表单数字输入（如数量、金额、ID选择器）时，必须使用 `z.coerce.number()`。

**✅ 正确 (表单场景):**

```typescript
const formSchema = z.object({
  age: z.coerce.number().int().positive('年龄必须为正数'),
  count: z.coerce.number().min(1, '至少为1'),
});
```

**❌ 严禁 (表单场景):**

```typescript
const formSchema = z.object({
  age: z.number(), // 必定报错：Expected number, received string
});
```

注：当定义后端 API 响应的 TypeScript 类型时，应严格使用
`z.number()`，禁止使用 coerce，以防止掩盖后端数据类型错误。
