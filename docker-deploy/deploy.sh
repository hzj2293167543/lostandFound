#!/bin/bash
set -e

echo "=== 一键部署 LostAndFound ==="

echo "[INFO] 检查 Docker..."
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker 未安装"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -f .env ]; then
    echo "[INFO] 加载环境变量..."
    export $(grep -v '^#' .env | xargs)
fi

API_BASE_URL=${BACKEND_URL:-}
if [ -n "$API_BASE_URL" ]; then
    echo "[INFO] 更新 API Base URL 配置..."
    sed -i "s|\"apiBaseUrl\": \"[^\"]*\"|\"apiBaseUrl\": \"$API_BASE_URL/api\"|" public/config.json 2>/dev/null || true
fi

WS_URL=${WS_URL:-}
if [ -n "$WS_URL" ]; then
    echo "[INFO] 更新 WebSocket 配置..."
    sed -i "s|\"wsUrl\": \"[^\"]*\"|\"wsUrl\": \"$WS_URL\"|" public/config.json 2>/dev/null || true
fi

STATIC_BASE_URL=${STATIC_BASE_URL:-}
if [ -n "$STATIC_BASE_URL" ]; then
    echo "[INFO] 更新 Static Base URL 配置..."
    sed -i "s|\"staticBaseUrl\": \"[^\"]*\"|\"staticBaseUrl\": \"$STATIC_BASE_URL\"|" public/config.json 2>/dev/null || true
fi

echo "[INFO] 停止旧容器..."
docker compose -f docker-compose.prod.yml down || true

echo "[INFO] 拉取最新镜像..."
docker compose -f docker-compose.prod.yml pull

echo "[INFO] 启动新容器..."
docker compose -f docker-compose.prod.yml up -d

echo "[INFO] 等待服务启动..."
sleep 10

echo "[INFO] 检查容器状态..."
docker compose -f docker-compose.prod.yml ps

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo "=== 部署完成 ==="
echo "前端: http://$SERVER_IP:8080"
echo "后端: http://$SERVER_IP:3000"
echo "Ollama: http://$SERVER_IP:11434"
