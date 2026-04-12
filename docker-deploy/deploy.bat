@echo off
setlocal enabledelayedexpansion

echo === 一键部署 LostAndFound ===

set "REGISTRY=%1"
if "%REGISTRY%"=="" set "REGISTRY=sgccr.ccs.tencentyun.com/fire/lostfound"

echo [INFO] 使用镜像仓库: %REGISTRY%
echo [INFO] 检查 Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker 未安装
    exit /b 1
)

echo [INFO] 停止旧容器...
docker compose -f "%~dp0docker-compose.prod.yml" down

echo [INFO] 拉取最新镜像...
docker compose -f "%~dp0docker-compose.prod.yml" pull

echo [INFO] 启动新容器...
docker compose -f "%~dp0docker-compose.prod.yml" up -d

echo [INFO] 等待服务启动...
timeout /t 10 /nobreak >nul

echo [INFO] 检查容器状态...
docker compose -f "%~dp0docker-compose.prod.yml" ps

echo.
echo === 部署完成 ===
for /f "delims=" %%i in ('curl -s ifconfig.me 2^>nul') do set "SERVER_IP=%%i"
if not defined SERVER_IP set "SERVER_IP=YOUR_SERVER_IP"
echo 前端: http://%SERVER_IP%:8080
echo 后端: http://%SERVER_IP%:3000
echo Ollama: http://%SERVER_IP%:11434

endlocal
