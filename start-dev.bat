@echo off
chcp 65001 >nul
echo ========================================
echo   番茄钟 Pomodoro Timer - 开发模式
echo ========================================
echo.

echo [1/3] 启动 Vite 开发服务器...
start "番茄钟-Vite" cmd /c "npx vite --host 0.0.0.0"

echo [2/3] 编译 Electron 主进程...
npx tsc -p tsconfig.electron.json
echo      TypeScript 编译完成

echo [3/3] 等待 Vite 就绪...
npx wait-on http://localhost:5173

echo 启动 Electron 桌面应用...
set NODE_ENV=development
npx electron .
