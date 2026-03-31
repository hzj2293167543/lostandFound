---
name: writing-frontend-logic
description:
  Triggered ONLY when writing React logic, API requests, data fetching, or forms. Do NOT trigger for
  pure UI/CSS styling or project configuration.
---

# 前端工程规范

## 1. 数据请求与接口封装

### 红线

- 严禁使用 `useEffect` + `fetch`/`axios` 获取数据。
- 严禁在 API 函数中手动拼接 query 参数。
- 必须使用 `@tanstack/react-query` 处理服务端状态。

### 结构标准

必须定义 TypeScript 类型，禁止裸传参数。

**✅ 正确:**

```typescript
interface ReportPaginationParams { page: number; size: number; status?: number; }

getReportsPaginated: (params: ReportPaginationParams) => {
  const searchParams = buildReportPaginationParams(params);
  return get<PageResponse<Report>>(`/admin/reports/paginated?${searchParams}`);
},
```

**❌ 严禁:**

```typescript
getReports: (page: number, size: number) => get(`/reports?page=${page}&size=${size}`),
```

## 2. 表单与校验

### 红线

- 严禁手写 `onChange` 逻辑进行校验。
- 必须使用 `react-hook-form` + `zodResolver` + `zod`。

### 结构标准

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ username: z.string().min(1, '不能为空') });
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```

## 3. UI 组件与样式

### 红线

- 严禁手写基础组件（Button/Input/Dialog），必须使用 `@/components/ui` (shadcn/ui)。
- 严禁内联 `style={{}}`，必须使用 Tailwind CSS 类名。

## 4. 长列表渲染

### 红线

- 渲染超过 100 条数据的列表（表格/聊天记录），必须使用 `@tanstack/react-virtual` 或
  `react-window`。严禁直接 `.map()` 渲染。

## 5. 异常与失败处理策略（强制执行）

### 网络请求失败

- `@tanstack/react-query` 必须配置 `retry` 重试策略。
- 失败状态必须通过 `isError` 在 UI 层给出明确提示，禁止静默失败。

### 表单校验失败

- 必须依赖 `zod` 错误信息（`errors.fieldName.message`）渲染在对应输入框下方。
- 严禁使用 `alert()` 或 `console.log` 处理校验错误。

## 6. 代码拆分触发条件

当单一文件或函数包含超过两个独立业务逻辑（如：同时包含复杂的数据转换和复杂的 UI 状态管理）时，强制触发拆分：提取自定义 Hooks 或抽离工具函数。

## 7. 禁止使用魔法数字
