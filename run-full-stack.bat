@echo off
echo ========================================
echo   CHINGGIZZ FULL STACK - LOCAL SETUP
echo ========================================
echo.
echo This will start BOTH backend and frontend
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo ========================================
echo.

echo Opening Backend in new window...
start "Chinggizz Backend" cmd /k run-local.bat

echo Waiting 5 seconds before starting frontend...
timeout /t 5 /nobreak

echo Opening Frontend in new window...
start "Chinggizz Frontend" cmd /k run-frontend.bat

echo.
echo ========================================
echo   BOTH SERVERS STARTING...
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Check the separate windows for logs
echo.
pause

