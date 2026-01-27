@echo off
REM ========================================
REM   Chinggizz Backend - Local Development
REM   Database: Supabase PostgreSQL
REM ========================================

echo.
echo ========================================
echo   Starting Chinggizz Backend
echo   Environment: Local Development
echo   Database: Supabase PostgreSQL
echo ========================================
echo.

REM Local development JWT and Admin credentials
set "JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production-minimum-256-bits"
set "ADMIN_PASSWORD=admin123"
set "WHATSAPP_NUMBER=7012897008"
set "UPLOAD_DIR=uploads/products"

REM Optional: Enable debug logging for local development
REM set "LOG_LEVEL=DEBUG"
REM set "HIBERNATE_LOG_LEVEL=DEBUG"
REM set "SHOW_SQL=true"

echo Starting backend server...
echo.
echo NOTE: Make sure you have set these environment variables:
echo   - SPRING_DATASOURCE_URL
echo   - SPRING_DATASOURCE_USERNAME
echo   - SPRING_DATASOURCE_PASSWORD
echo.
echo Or the application will use defaults from application.yml
echo.

REM Run Maven
mvn clean spring-boot:run

pause

