@echo off
setlocal enabledelayedexpansion

set "REGISTRY=sgccr.ccs.tencentyun.com/fire/lostfound"
set "SERVICES=%*"

if "%SERVICES%"=="" set "SERVICES=postgres backend frontend ollama"

echo === 推送 Docker 镜像 ===

docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] 未登录 Docker，请先执行:
    echo   docker login %REGISTRY% --username=你的用户名
    exit /b 1
)

for %%S in (%SERVICES%) do (
    echo.
    echo [INFO] 推送 %%S...
    docker tag "lostandfound-%%S:latest" "%REGISTRY%:%%S"
    docker push "%REGISTRY%:%%S"
    echo [OK] %%S 推送完成
)

echo.
echo === 全部推送完成 ===
echo Registry: %REGISTRY%
for %%S in (%SERVICES%) do (
    echo   - %%S
)

endlocal
