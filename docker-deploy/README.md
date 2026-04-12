# LostAndFound Docker 部署

## 目录结构

```
docker-deploy/
├── docker-compose.prod.yml  # 生产环境编排文件（从腾讯云拉取镜像）
├── deploy.bat            # Windows 一键部署脚本
├── deploy.sh             # Linux/Mac 部署脚本
└── .env.example         # 环境变量模板
```

## 快速部署

### 1. 复制环境变量

```bash
cp .env.example .env
```

### 2. 修改 .env

必须修改：

- `JWT_SECRET` — 随机字符串
- `POSTGRES_PASSWORD` — 数据库密码
- `BACKEND_URL` — 服务器实际 IP 或域名
- `AI_LLM_API_KEY` — 如果使用在线 LLM

### 3. 一键部署

**Windows:**

```bash
deploy.bat
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

## 服务地址

- 前端：http://localhost:8080
- 后端：http://localhost:3000
- Ollama：http://localhost:11434
