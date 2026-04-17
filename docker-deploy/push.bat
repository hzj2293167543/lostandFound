@echo off
setlocal enabledelayedexpansion

set "REGISTRY=sgccr.ccs.tencentyun.com/fire/lostfound"
set "SERVICES=%*"
if "%SERVICES%"=="" set "SERVICES=postgres backend frontend ollama"

if not defined TAG (
    for /f "tokens=*" %%i in ('git rev-parse --short HEAD 2^>nul') do set "TAG=%%i"
    if not defined TAG (
        for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format yyyyMMddHHmmss"') do set "TAG=%%i"
    )
)

echo === Push Docker Images ===
echo [INFO] TAG: %TAG%

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
    docker tag "lostandfound-%%S:latest" "%REGISTRY%:%%S-%TAG%"
    docker push "%REGISTRY%:%%S-%TAG%"
    echo [OK] %%S 推送完成
)

echo.
echo === 全部推送完成 ===
echo Registry: %REGISTRY%
echo TAG: %TAG%
echo.
echo Deployed (use :latest to pull):
for %%S in (%SERVICES%) do (
    echo   - %REGISTRY%:%%S
)
echo.
echo Archived (for rollback, keep 5 versions):
for %%S in (%SERVICES%) do (
    echo   - %REGISTRY%:%%S-%TAG%
)

endlocal
