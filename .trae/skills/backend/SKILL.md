---
name: backend
description: 当编写或修改后端业务逻辑代码时触发。（不要因配置文件更改或日志分析而触发）
---

1. 禁止在模块内部创建本地 `dto` 文件夹。必须使用 `shared` 目录中的 DTO。
2. 禁止在 Controller 中编写业务逻辑或数据库查询。
3. 禁止使用多个 @Body('xxx')
   @Query('xxx') 逐个提取请求体字段。必须将相关字段封装为一个 DTO 对象，并使用 ZodValidationPipe 进行校验。反面教材 (严禁模仿):

// 参数一多，极容易漏掉、写错，且无法复用

```ts
handleUserReport( @Body('status') status: string,
@Body('result') result: string, @Body('type') type: number)
```

正确示例 (必须遵循): // 整体接收，类型安全，复用 shared 中的 Schema

```ts
handleUserReport( @Body(new
ZodValidationPipe(HandleReportSchema)) body: HandleReportDto )
```

4. 禁止在没有await 关键字的情况下使用 async 函数。
