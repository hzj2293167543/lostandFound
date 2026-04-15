#!/bin/bash
set -e

echo "=== LostAndFound 部署脚本 ==="

show_help() {
    echo "用法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  frontend     仅部署前端"
    echo "  backend      仅部署后端"
    echo "  all          部署前端+后端 (默认)"
    echo "  clean        清除数据库卷并部署全部"
    echo "  help         显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh frontend   # 只部署前端"
    echo "  ./deploy.sh backend    # 只部署后端"
    echo "  ./deploy.sh clean      # 清除数据库卷并部署全部"
    echo "  ./deploy.sh            # 部署全部"
}

TARGET="${1:-all}"

case "$TARGET" in
    frontend|backend|all|clean)
        ;;
    help|--help|-h)
        show_help
        exit 0
        ;;
    *)
        echo "[ERROR] 未知选项: $TARGET"
        show_help
        exit 1
        ;;
esac

echo "[INFO] 部署目标: $TARGET"

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

update_config() {
    local key=$1
    local value=$2
    local file="public/config.json"

    if [ -z "$value" ]; then
        return
    fi

    if [ ! -f "$file" ]; then
        echo "[WARN] $file 不存在，跳过配置更新"
        return
    fi

    echo "[INFO] 更新 $key 配置..."
    local escaped_value=$(echo "$value" | sed 's/[\/&]/\\&/g')
    sed -i "s/\"$key\": \"[^\"]*\"/\"$key\": \"$escaped_value\"/" "$file"
}

API_BASE_URL=${BACKEND_URL:-}
if [ -n "$API_BASE_URL" ]; then
    update_config "apiBaseUrl" "$API_BASE_URL/api"
fi

WS_URL=${WS_URL:-}
if [ -n "$WS_URL" ]; then
    update_config "wsUrl" "$WS_URL"
fi

STATIC_BASE_URL=${STATIC_BASE_URL:-}
if [ -n "$STATIC_BASE_URL" ]; then
    update_config "staticBaseUrl" "$STATIC_BASE_URL"
fi

get_services() {
    local target=$1
    case "$target" in
        frontend)
            echo "frontend"
            ;;
        backend)
            echo "postgres backend"
            ;;
        all)
            echo "postgres backend frontend"
            ;;
    esac
}

SERVICES=$(get_services "$TARGET")
COMMON_SERVICES="postgres backend frontend"

if [ "$TARGET" = "clean" ]; then
    echo "[WARN] 清除模式：删除数据库卷！"
    read -p "确认删除数据库卷? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "[INFO] 已取消"
        exit 0
    fi

    echo "[INFO] 停止容器..."
    docker compose -f docker-compose.prod.yml stop $COMMON_SERVICES 2>/dev/null || true

    echo "[INFO] 删除数据库卷..."
    docker compose -f docker-compose.prod.yml down -v postgres 2>/dev/null || true

    echo "[INFO] 重新部署全部服务..."
    TARGET="all"
    SERVICES=$(get_services "$TARGET")
fi

echo "[INFO] 停止旧容器..."
for svc in $COMMON_SERVICES; do
    docker compose -f docker-compose.prod.yml stop "$svc" 2>/dev/null || true
done

echo "[INFO] 拉取最新镜像..."
docker compose -f docker-compose.prod.yml pull $SERVICES

echo "[INFO] 启动容器: $SERVICES..."
if [ "$TARGET" = "all" ]; then
    docker compose -f docker-compose.prod.yml up -d $SERVICES
elif [ "$TARGET" = "frontend" ]; then
    docker compose -f docker-compose.prod.yml up -d frontend
elif [ "$TARGET" = "backend" ]; then
    docker compose -f docker-compose.prod.yml up -d postgres backend
fi

echo "[INFO] 等待服务启动..."
sleep 5

echo "[INFO] 检查容器状态..."
docker compose -f docker-compose.prod.yml ps

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo "=== 部署完成 ==="
if [ "$TARGET" = "frontend" ] || [ "$TARGET" = "all" ]; then
    echo "前端: http://$SERVER_IP:8080"
fi
if [ "$TARGET" = "backend" ] || [ "$TARGET" = "all" ]; then
    echo "后端: http://$SERVER_IP:3000"
fi
