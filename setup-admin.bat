@echo off
echo ========================================
echo Hospital Management System - Admin Setup
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating environment file...
if not exist .env (
    copy config.env .env
    echo Environment file created from config.env
) else (
    echo Environment file already exists
)

echo.
echo Step 3: Attempting to create admin account...
echo Note: Make sure MongoDB is running before proceeding
echo.
pause

call node seedAdmin.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Admin Login Credentials:
echo Email: admin@hospital.com
echo Password: admin123
echo.
echo Next steps:
echo 1. Start MongoDB if not already running
echo 2. Run: npm start (in backend folder)
echo 3. Run: npm run dev (in frontend folder)
echo 4. Login with admin credentials
echo.
pause
