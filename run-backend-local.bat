@echo off
echo ========================================
echo   Starting Chinggizz Backend (LOCAL)
echo   Database: H2 In-Memory
echo   Profile: local
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

REM Set local profile
set "SPRING_PROFILES_ACTIVE=local"

REM Run with explicit profile argument
mvn clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local"

