# Test Supabase Database Connection
# This script tests different connection configurations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Supabase Database Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Connection Pooler (Port 6543)
Write-Host "Test 1: Connection Pooler (Port 6543)" -ForegroundColor Yellow
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0&connectTimeout=30&socketTimeout=30"
$env:SPRING_DATASOURCE_USERNAME = "postgres.pzgnowrxbiefhxsoukxc"
$env:SPRING_DATASOURCE_PASSWORD = "Chinggizz098"
$env:JWT_SECRET = "test-jwt-secret-key-minimum-256-bits-long-for-testing-purposes-only"
$env:ADMIN_PASSWORD = "TestAdmin123"

Write-Host "URL: $env:SPRING_DATASOURCE_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "Running connection test..." -ForegroundColor Green

mvn spring-boot:run -Dspring-boot.run.arguments="--spring.main.web-application-type=none"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

