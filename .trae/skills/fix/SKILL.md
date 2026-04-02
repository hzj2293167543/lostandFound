---
name: /fix
description:
  Triggered ONLY when user asks to resolve Lint/TypeScript errors that cannot be auto-fixed (e.g.,
  "解决剩余报错", "处理红线", "深度清理代码"). Do NOT trigger for simple formatting (e.g., "格式化",
  "跑 prettier"), as those should be handled directly by running prettier commands without this
  skill.
---

# Lint 自动修复与熔断工作流

## 执行步骤

运行 pnpm run
lint:fix 尝试自动修复。读取终端输出，定位剩余错误。若存在无法自动修复的错误（如 TS 类型错误、逻辑错误）：定位具体文件与行号。读取 .ai-context/lessons-learned.md 检查历史避坑记录。直接修改代码解决错误，禁止询问用户怎么做。修复后再次运行 pnpm
run lint 验证。

### 绝对红线与熔断机制配置隔离：

严禁修改任何工程配置文件（包括但不限于 tsconfig.json、oxlint.config._、eslint.config._、prettier.config.\*）。只能修改业务代码。

### 三次熔断：

针对同一个具体的错误（同文件+同行号/同规则），如果连续修改 3 次仍无法通过 Lint，必须触发熔断。熔断动作：触发熔断后，禁止继续尝试修改业务逻辑。必须在报错代码的正上方添加对应的 Lint 抑制注释（如 //
oxlint-disable-next-line 或 // eslint-disable-next-line
no-unused-vars），以此强行绕过检查，确保最终 pnpm run lint 能够返回 0 错误。
