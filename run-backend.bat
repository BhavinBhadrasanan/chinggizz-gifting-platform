@echo off
echo ========================================
echo Starting Chinggizz Backend Server
echo ========================================

REM Set environment variables
set JWT_SECRET=chinggizz-secret-key-for-local-development-only-change-in-production
set JWT_EXPIRATION=86400000
set ADMIN_USERNAME=admin
set ADMIN_PASSWORD=admin123
set WHATSAPP_NUMBER=7012897008
set UPLOAD_DIR=uploads/products
set PORT=8080
set LOG_LEVEL=INFO
set HIBERNATE_LOG_LEVEL=WARN
set SHOW_SQL=false
set HIBERNATE_DDL_AUTO=validate
set INCLUDE_ERROR_MESSAGE=never
set INCLUDE_BINDING_ERRORS=never

REM Database Configuration (Supabase PostgreSQL)
set SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require^&prepareThreshold=0^&connectTimeout=60^&socketTimeout=60^&tcpKeepAlive=true^&ApplicationName=chinggizz-app
set SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
set SPRING_DATASOURCE_PASSWORD=Chinggizz098

echo Environment variables set successfully!
echo Starting Spring Boot application...
echo.

mvn spring-boot:run

