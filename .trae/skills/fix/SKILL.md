---
name: /fix
description:
  Triggered ONLY when user asks to resolve Lint/TypeScript errors that cannot be auto-fixed (e.g.,
  "解决剩余报错", "处理红线", "深度清理代码"). Do NOT trigger for simple formatting.
---

# Lint 深度修复工作流

## 阶段 1：自动修复

运行 pnpm run lint:fix。读取输出，过滤掉已被自动修复的项，提取出【剩余错误列表】。

## 阶段 2：深度分析与定向修复（禁止盲改）

针对【剩余错误列表】中的每一个错误，必须严格按以下顺序执行，禁止直接修改代码：

原因定性：分析该错误是“真正的代码缺陷”还是“规则误判”。例如：require-await 通常是代码缺陷（应删除 async）；no-unused-vars 可能是未完成的逻辑。方案输出：在修改前，必须用一句话简述修复方案。执行修复：应用修改。

## 阶段 3：二次验证

再次运行 pnpm run lint 验证。

# 绝对红线与熔断机制

1. 配置隔离：严禁修改任何工程配置文件（tsconfig、eslint、oxlint 等）。只能改业务代码。
2. 严禁伪造通过：绝对禁止使用 // oxlint-disable 或 //
   eslint-disable 注释来强行消除报错。这是严重违规。
3. 人工接管熔断：针对同一个错误，如果尝试修复 2 次依然失败，必须立即停止修改该错误。最终验证时，只要剩余错误数量不再增加，即视为任务完成，将未解决的错误以列表形式汇报给用户，由人工决策。
