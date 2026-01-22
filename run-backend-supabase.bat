@echo off
echo ========================================
echo   Starting Chinggizz Backend (LOCAL)
echo   Database: Supabase PostgreSQL
echo   Profile: supabase
echo ========================================
echo.

REM Clear ALL database-related environment variables
set "SPRING_DATASOURCE_URL="
set "SPRING_DATASOURCE_USERNAME="
set "SPRING_DATASOURCE_PASSWORD="
set "SPRING_DATASOURCE_DRIVER_CLASS_NAME="
set "spring.datasource.url="
set "spring.datasource.username="
set "spring.datasource.password="
set "spring.datasource.driver-class-name="

REM Set Supabase profile
set "SPRING_PROFILES_ACTIVE=supabase"

REM Local development settings
set "JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production"
set "ADMIN_PASSWORD=admin123"

echo Database: Supabase PostgreSQL (Production)
echo Profile: supabase
echo.
echo Starting backend server...
echo.

REM Run Maven with supabase profile and explicit JVM arguments
mvn clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=supabase"

