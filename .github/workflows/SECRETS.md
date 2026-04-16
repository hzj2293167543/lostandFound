# GitHub Secrets 配置说明

本项目使用 GitHub Actions 进行 CI/CD 和 Docker 部署，需要在 GitHub 仓库的 Secrets 中配置以下变量。

## 📋 Secrets 列表

### Docker 镜像仓库配置

| Secret 名称       | 说明                    | 示例值                                |
| ----------------- | ----------------------- | ------------------------------------- |
| `DOCKER_REGISTRY` | Docker 镜像仓库地址     | `ccr.ccs.tencentyun.com/lostandfound` |
| `DOCKER_USERNAME` | Docker 仓库用户名       | `your-username`                       |
| `DOCKER_PASSWORD` | Docker 仓库密码或 Token | `your-password-or-token`              |

### 服务器部署配置

| Secret 名称      | 说明                      | 示例值                                 |
| ---------------- | ------------------------- | -------------------------------------- |
| `SERVER_HOST`    | 服务器 IP 地址            | `123.45.67.89`                         |
| `SERVER_USER`    | 服务器登录用户名          | `root`                                 |
| `SERVER_SSH_KEY` | 服务器 SSH 私钥           | `-----BEGIN RSA PRIVATE KEY-----\n...` |
| `SERVER_PORT`    | SSH 端口（可选，默认 22） | `22`                                   |

### 数据库配置

| Secret 名称         | 说明                | 示例值                 |
| ------------------- | ------------------- | ---------------------- |
| `POSTGRES_USER`     | PostgreSQL 用户名   | `lostfound`            |
| `POSTGRES_PASSWORD` | PostgreSQL 密码     | `your-secure-password` |
| `POSTGRES_DB`       | PostgreSQL 数据库名 | `lostfound`            |

### 应用配置

| Secret 名称       | 说明           | 示例值                          |
| ----------------- | -------------- | ------------------------------- |
| `BACKEND_URL`     | 后端 API 地址  | `https://api.yourdomain.com`    |
| `WS_URL`          | WebSocket 地址 | `wss://api.yourdomain.com`      |
| `STATIC_BASE_URL` | 静态资源地址   | `https://static.yourdomain.com` |

### JWT 配置

| Secret 名称      | 说明         | 示例值                                        |
| ---------------- | ------------ | --------------------------------------------- |
| `JWT_SECRET`     | JWT 签名密钥 | `your-super-secret-jwt-key-at-least-32-chars` |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d`                                          |

### CORS 配置

| Secret 名称    | 说明           | 示例值                                              |
| -------------- | -------------- | --------------------------------------------------- |
| `CORS_ORIGINS` | 允许的跨域来源 | `https://yourdomain.com,https://www.yourdomain.com` |

### AI 配置

| Secret 名称         | 说明                  | 示例值                                                   |
| ------------------- | --------------------- | -------------------------------------------------------- |
| `AI_LLM_MODEL`      | LLM 模型名称          | `glm-4-flash`                                            |
| `AI_LLM_API_KEY`    | LLM API Key           | `your-api-key`                                           |
| `AI_LLM_CHAT_URL`   | LLM 聊天接口          | `https://open.bigmodel.cn/api/paas/v4/chat/completions`  |
| `AI_LLM_SEARCH_URL` | LLM 搜索接口          | `https://open.bigmodel.cn/api/paas/v4/async-ssemessages` |
| `AI_OLLAMA_MODEL`   | Ollama Embedding 模型 | `nomic-embed-text:latest`                                |
| `AI_OLLAMA_URL`     | Ollama 服务地址       | `http://ollama:11434`                                    |

---

## 🔧 配置步骤

### 1. 进入 Secrets 配置页面

1. 打开 GitHub 仓库
2. 点击 **Settings**
3. 在左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 添加每个 Secret

### 2. SSH 密钥生成（如果没有）

```bash
# 在本地生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions

# 复制私钥内容到 SERVER_SSH_KEY
cat ~/.ssh/github_actions

# 将公钥添加到服务器的 ~/.ssh/authorized_keys
cat ~/.ssh/github_actions.pub | ssh user@your-server 'cat >> ~/.ssh/authorized_keys'
```

### 3. 服务器准备

确保服务器上已创建部署目录：

```bash
ssh user@your-server
mkdir -p /opt/lostfound
cd /opt/lostfound
```

---

## 📝 注意事项

- **所有 Secrets 都是敏感信息，切勿提交到代码仓库**
- `JWT_SECRET` 建议使用至少 32 个字符的随机字符串
- `SERVER_SSH_KEY` 需要包含完整的私钥内容，包括 `-----BEGIN RSA PRIVATE KEY-----` 和
  `-----END RSA PRIVATE KEY-----`
- Docker 注册表如果是私有仓库，需要确保用户名和密码正确
- 生产环境建议使用强密码和定期轮换密钥

---

## 🚀 触发部署

配置完成后，可以通过以下方式触发部署：

1. **自动触发**：推送代码到 `master` 分支
2. **手动触发**：
   - 进入 GitHub 仓库的 **Actions** 页面
   - 选择 **Docker Deploy** 工作流
   - 点击 **Run workflow**
   - 选择部署目标和是否清除数据库
   - 点击 **Run workflow** 确认
