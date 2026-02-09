@echo off
echo Starting Chinggizz Backend
echo Environment: Local Development
echo Database: Supabase PostgreSQL
echo.
set "JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production-minimum-256-bits"
set "ADMIN_PASSWORD=admin123"
set "WHATSAPP_NUMBER=7012897008"
set "UPLOAD_DIR=uploads/products"
set "SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0&connectTimeout=60&socketTimeout=60&tcpKeepAlive=true&ApplicationName=chinggizz-app"
set "SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc"
set "SPRING_DATASOURCE_PASSWORD=Chinggizz098"

mvn clean spring-boot:run
pause

