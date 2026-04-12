# ===== 阶段1：依赖安装 =====
FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false --shamefully-hoist

# ===== 阶段2：构建（继承 deps，node_modules 已存在）=====
FROM deps AS builder
WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm --filter @lostfound/shared build && \
    pnpm --filter @monorepo/backend build && \
    pnpm deploy --filter @monorepo/backend --prod ./deploy

# ===== 阶段3：运行 =====
FROM node:24-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app/uploads

COPY --from=builder --chown=nestjs:nodejs /app/deploy/. ./

USER nestjs

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
