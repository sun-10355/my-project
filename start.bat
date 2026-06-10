@echo off
chcp 65001 >nul
echo ========================================
echo   番茄钟 Pomodoro Timer
echo ========================================
echo.

:: Check if dist exists, if not build
if not exist "dist\index.html" (
    echo 正在构建前端资源...
    call npx vite build
    echo.
)

if not exist "dist-electron\main.js" (
    echo 正在编译主进程...
    call npx tsc -p tsconfig.electron.json
    echo.
)

echo 启动番茄钟...
npx electron .
