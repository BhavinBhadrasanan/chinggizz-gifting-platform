@echo off
echo Starting Chinggizz Backend (LOCAL)
echo Database: Supabase PostgreSQL
echo.
set "SPRING_DATASOURCE_URL="
set "SPRING_DATASOURCE_USERNAME="
set "SPRING_DATASOURCE_PASSWORD="
set "SPRING_DATASOURCE_DRIVER_CLASS_NAME="
set "spring.datasource.url="
set "spring.datasource.username="
set "spring.datasource.password="
set "spring.datasource.driver-class-name="
set "SPRING_PROFILES_ACTIVE=supabase"
set "JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production"
set "ADMIN_PASSWORD=admin123"

mvn clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=supabase"

