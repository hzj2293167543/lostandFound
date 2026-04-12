# ===== 阶段1：依赖安装 =====
FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false --shamefully-hoist

# ===== 阶段2：构建（继承 deps，node_modules 已存在）=====
FROM deps AS builder
WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm --filter @lostfound/shared build && \
    pnpm --filter @monorepo/frontend build

# ===== 阶段3：Nginx 运行 =====
FROM nginx:alpine AS runner

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/apps/frontend/public /usr/share/nginx/html/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
