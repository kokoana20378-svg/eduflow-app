@echo off
echo === EduFlow Deployment Script ===
echo.

:: Step 1: Check prerequisites
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Git not found! Install from https://git-scm.com/
    exit /b 1
)

:: Step 2: Initialize Git if needed
if not exist .git (
    git init
    git add -A
    git commit -m "Initial commit - EduFlow"
    echo Git repository initialized.
)

:: Step 3: Deploy to Railway
echo.
echo To deploy to Railway:
echo 1. Sign up at https://railway.com (use GitHub login)
echo 2. Get your token from https://railway.com/account/tokens
echo 3. Run: railway login
echo 4. Run: railway init
echo 5. Run: railway up
echo.
echo Or use RAILWAY_TOKEN for automated deployment:
echo   set RAILWAY_TOKEN=your_token_here
echo   railway up --ci --service=eduflow
echo.
echo === Ready for deployment! ===
