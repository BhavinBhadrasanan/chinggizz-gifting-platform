@echo off
echo Starting Chinggizz Backend
echo Environment: Local Development
echo Database: Supabase PostgreSQL
echo.
set "JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production-minimum-256-bits"
set "ADMIN_PASSWORD=admin123"
set "WHATSAPP_NUMBER=7012897008"
set "UPLOAD_DIR=uploads/products"

mvn clean spring-boot:run
pause

