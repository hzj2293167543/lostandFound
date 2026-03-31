项目背景 Monorepo 架构。目录结构：apps/backend (NestJS+MySQL+Vitest), apps/frontend (React+Vite+TS),
packages/shared。跨包引用必须使用 workspace 别名（如 @workspace/shared），严禁使用 ../../ 相对路径。

1. 类型安全（最高优先级）严禁使用 any 类型。必须使用明确的 Interface、Type 或泛型。逃生舱：如果遇到极其复杂且无法推导的第三方库类型，必须使用 unknown 并配合类型守卫，或在行内加 //
   @ts-expect-error 具体原因，绝对不允许裸写 any 跑过检查。
2. 环境约束包管理器：强制使用 pnpm。严禁使用 npm 或 yarn。
3. 前端红线 UI/样式：必须使用 shadcn/ui + Tailwind
   CSS。严禁手写基础组件或原生 CSS。图标：必须使用 lucide-react。数据请求：必须使用 @tanstack/react-query。严禁用 useEffect 请求数据。表单：必须使用 react-hook-form +
   zod。严禁手写 onChange 校验。列表：长列表必须使用 @tanstack/react-virtual 或 react-window。
4. 后端红线 DTO：必须从 packages/shared 引入，严禁在模块本地建 dto/ 文件夹。逻辑：严禁在 Controller 里写数据库查询。
5. 代码检查主力用 Oxlint，辅助用 ESLint，格式化用 Prettier。严禁无视 Oxlint 报错。
