#!/bin/bash
set -e

REGISTRY=${REGISTRY:-"sgccr.ccs.tencentyun.com/fire/lostfound"}
SERVICES=${*:-"postgres backend frontend ollama"}

echo "=== 推送 Docker 镜像 ==="

if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] 未登录 Docker，请先执行:"
    echo "  docker login $REGISTRY --username=你的用户名"
    exit 1
fi

for SERVICE in $SERVICES; do
    echo ""
    echo "[INFO] 推送 $SERVICE..."
    docker tag lostandfound-${SERVICE}:latest ${REGISTRY}:${SERVICE}
    docker push ${REGISTRY}:${SERVICE}
    echo "[OK] $SERVICE 推送完成"
done

echo ""
echo "=== 全部推送完成 ==="
echo "Registry: $REGISTRY"
for SERVICE in $SERVICES; do
    echo "  - ${SERVICE}:latest"
done
