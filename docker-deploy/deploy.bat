@echo off
setlocal enabledelayedexpansion

echo === LostAndFound 部署脚本 ===

:show_help
echo 用法: deploy.bat [选项]
echo.
echo 选项:
echo   frontend     仅部署前端
echo   backend      仅部署后端
echo   all          部署前端+后端 (默认)
echo   clean        清除数据库卷并部署全部
echo   help         显示帮助信息
echo.
echo 示例:
echo   deploy.bat frontend   # 只部署前端
echo   deploy.bat backend    # 只部署后端
echo   deploy.bat clean      # 清除数据库卷并部署全部
echo   deploy.bat            # 部署全部
goto :eof

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=all"

if /i "%TARGET%"=="help" goto :show_help
if /i "%TARGET%"=="--help" goto :show_help
if /i "%TARGET%"=="-h" goto :show_help

if /i not "%TARGET%"=="frontend" if /i not "%TARGET%"=="backend" if /i not "%TARGET%"=="all" if /i not "%TARGET%"=="clean" (
    echo [ERROR] 未知选项: %TARGET%
    goto :show_help
)

echo [INFO] 部署目标: %TARGET%

echo [INFO] 检查 Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker 未安装
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

if exist ".env" (
    echo [INFO] 加载环境变量...
    for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#"') do (
        set "%%a=%%b"
    )
)

if exist "public\config.json" (
    echo [INFO] 更新配置文件...
    powershell -Command "$config = Get-Content 'public\config.json' -Raw | ConvertFrom-Json; if ($env:BACKEND_URL) { $config.apiBaseUrl = $env:BACKEND_URL + '/api' }; if ($env:WS_URL) { $config.wsUrl = $env:WS_URL }; if ($env:STATIC_BASE_URL) { $config.staticBaseUrl = $env:STATIC_BASE_URL }; $config | ConvertTo-Json -Depth 10 | Set-Content 'public\config.json'"
) else (
    echo [WARN] public\config.json 不存在，跳过配置更新
)

set "COMMON_SERVICES=postgres backend frontend"

if /i "%TARGET%"=="clean" (
    echo [WARN] 清除模式：删除数据库卷！
    set /p confirm="确认删除数据库卷? (yes/no): "
    if /i not "!confirm!"=="yes" (
        echo [INFO] 已取消
        exit /b 0
    )

    echo [INFO] 停止容器...
    docker compose -f docker-compose.prod.yml stop %COMMON_SERVICES% 2>nul || echo [WARN] 部分容器可能未运行

    echo [INFO] 删除数据库卷...
    docker compose -f docker-compose.prod.yml down -v postgres 2>nul || echo [WARN] 数据库卷可能不存在

    echo [INFO] 重新部署全部服务...
    set "TARGET=all"
)

echo [INFO] 停止旧容器...
for %%s in (%COMMON_SERVICES%) do (
    docker compose -f docker-compose.prod.yml stop %%s 2>nul || echo [WARN] %%s 可能未运行
)

set "SERVICES="
if /i "%TARGET%"=="frontend" set "SERVICES=frontend"
if /i "%TARGET%"=="backend" set "SERVICES=postgres backend"
if /i "%TARGET%"=="all" set "SERVICES=postgres backend frontend"

if defined DOCKER_PASSWORD (
    echo [INFO] 登录镜像仓库...
    echo %DOCKER_PASSWORD% | docker login %REGISTRY% -u %DOCKER_USERNAME% --password-stdin
)

echo [INFO] 拉取最新镜像...
docker compose -f docker-compose.prod.yml pull %SERVICES%

echo [INFO] 启动容器: %SERVICES%...
if /i "%TARGET%"=="all" (
    docker compose -f docker-compose.prod.yml up -d %SERVICES%
) else if /i "%TARGET%"=="frontend" (
    docker compose -f docker-compose.prod.yml up -d frontend
) else if /i "%TARGET%"=="backend" (
    docker compose -f docker-compose.prod.yml up -d postgres backend
)

echo [INFO] 等待服务启动...
timeout /t 5 /nobreak >nul

echo [INFO] 检查容器状态...
docker compose -f docker-compose.prod.yml ps

set "SERVER_IP="
for /f "delims=" %%i in ('curl -s ifconfig.me 2^>nul') do set "SERVER_IP=%%i"
if not defined SERVER_IP set "SERVER_IP=YOUR_SERVER_IP"

echo.
echo === 部署完成 ===
if /i "%TARGET%"=="frontend" (
    echo 前端: http://%SERVER_IP%:8080
) else if /i "%TARGET%"=="backend" (
    echo 后端: http://%SERVER_IP%:3000
) else if /i "%TARGET%"=="all" (
    echo 前端: http://%SERVER_IP%:8080
    echo 后端: http://%SERVER_IP%:3000
)

endlocal
