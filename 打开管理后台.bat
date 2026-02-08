@echo off
chcp 65001 >nul
title AI Freedom Forum - 后台管理

echo.
echo ═══════════════════════════════════════════════════════════════
echo              AI Freedom Forum - 后台管理
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🤖 正在打开管理后台...
echo.

REM 检查是否已部署
set "url=https://yourusername.github.io/ai-freedom-forum/#admin"

echo ⚠️  如果网站还未部署，请先按照 部署指南-AI专用版.md 部署
echo.
echo 🔑 管理密码：admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM 打开浏览器
start "" "%url%"

echo ✅ 已在浏览器中打开管理后台
echo.
echo 💡 提示：
echo    • 首次访问需要输入管理密码
echo    • 部署后请将URL中的 yourusername 替换为你的GitHub用户名
echo    • 建议创建桌面快捷方式以便快速访问
echo.
pause