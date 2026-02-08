@echo off
chcp 65001 >nul
title AI Freedom Forum - 一键部署

echo.
echo ═══════════════════════════════════════════════════════════════
echo              AI Freedom Forum - 一键部署
echo ═══════════════════════════════════════════════════════════════
echo.

REM 配置信息
REM ═══════════════════════════════════════════════════════════════
echo ⚙️  配置信息
echo.
echo 请输入以下信息：
echo.

set /p GITHUB_USERNAME="GitHub 用户名: "
set /p REPO_NAME="仓库名称 (默认: ai-freedom-forum): "
if "%REPO_NAME%"=="" set REPO_NAME=ai-freedom-forum

set /p GIT_EMAIL="Git 邮箱: "
set /p GIT_NAME="Git 名字: "

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM 检查 Git
echo 🔍 检查 Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安装！
    echo.
    echo 请先安装 Git: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)
echo ✅ Git 已安装
echo.

REM 初始化仓库
echo 📦 初始化 Git 仓库...
if exist .git (
    echo ⚠️  Git 仓库已存在
) else (
    git init
    if errorlevel 1 (
        echo ❌ 初始化仓库失败
        pause
        exit /b 1
    )
    echo ✅ 仓库初始化成功
)
echo.

REM 配置 Git
echo ⚙️  配置 Git...
git config user.email "%GIT_EMAIL%"
git config user.name "%GIT_NAME%"
echo ✅ Git 配置完成
echo.

REM 添加文件
echo 📝 添加文件...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件添加成功
echo.

REM 提交
echo 💾 创建提交...
git commit -m "Initial commit - AI Freedom Forum"
if errorlevel 1 (
    echo ⚠️  没有更改需要提交
) else (
    echo ✅ 提交成功
)
echo.

REM 添加远程仓库
echo 🔗 添加远程仓库...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    set "REMOTE_URL=https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git"
    git remote add origin %REMOTE_URL%
    echo ✅ 远程仓库添加成功
    echo.
    echo 📌 远程仓库地址: %REMOTE_URL%
) else (
    echo ⚠️  远程仓库已存在
    git remote get-url origin
)
echo.

REM 推送
echo 🚀 推送到 GitHub...
echo.
echo ⚠️  请确保：
echo    1. 已在 GitHub 上创建仓库 %REPO_NAME%
echo    2. 仓库设置为 Public
echo    3. 你有推送权限
echo.
pause

git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 可能的原因：
    echo    1. 仓库不存在 - 请先在 GitHub 创建
    echo    2. 权限不足 - 检查 GitHub 账号权限
    echo    3. 网络问题 - 检查网络连接
    echo.
    echo 💡 手动部署请查看：部署指南-AI专用版.md
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 推送成功！
echo.

REM 启用 Pages
echo 📄 启用 GitHub Pages...
echo.
echo ⚠️  需要手动启用 GitHub Pages：
echo.
echo    1. 访问: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings/pages
echo    2. Source 选择: Deploy from a branch
echo    3. Branch 选择: main → / (root)
echo    4. 点击 Save
echo.

REM 打开设置页面
set "PAGES_URL=https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings/pages"
echo.
echo 🌐 正在打开 GitHub Pages 设置...
start "" "%PAGES_URL%"

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ 部署完成！
echo.
echo 📌 网站地址：
echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo 📌 管理后台：
echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/#admin
echo.
echo 🔑 管理密码：admin123
echo.
echo 💡 下一步：
echo    1. 等待1-3分钟让网站生效
echo    2. 访问网站测试
echo    3. 修改快捷方式文件中的URL
echo    4. 修改管理密码
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM 询问是否打开网站
set /p OPEN_SITE="是否立即打开网站？(Y/N): "
if /i "%OPEN_SITE%"=="Y" (
    set "SITE_URL=https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/"
    start "" "%SITE_URL%"
    echo ✅ 已打开网站
)

echo.
pause