@echo off
echo ========================================
echo   CHINGGIZZ FRONTEND - LOCAL SETUP
echo ========================================
echo Environment: Local Development
echo Backend API: http://localhost:8080/api
echo Port: 5173 (Vite default)
echo ========================================
echo.

cd frontend

echo [1/2] Installing dependencies (if needed)...
call npm install

echo.
echo [2/2] Starting Vite development server...
echo Frontend will be available at: http://localhost:5173
echo.

call npm run dev

pause

