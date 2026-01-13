# Run Chinggizz Backend with Supabase Profile

# Clear any existing database environment variables
Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_USERNAME -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_DRIVER_CLASS_NAME -ErrorAction SilentlyContinue

# Set Spring profile for local development
$env:SPRING_PROFILES_ACTIVE="local"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require&connectTimeout=60&socketTimeout=60&loginTimeout=60"
$env:SPRING_DATASOURCE_USERNAME="postgres.pzgnowrxbiefhxsoukxc"
$env:SPRING_DATASOURCE_PASSWORD="Chinggizz098"
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="org.postgresql.Driver"

# Local development settings (not needed in production)
$env:JWT_SECRET="chinggizz-local-dev-secret-key-not-for-production"
$env:ADMIN_PASSWORD="admin123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Chinggizz Backend Server" -ForegroundColor Cyan
Write-Host "  Profile: local (development)" -ForegroundColor Green
Write-Host "  Database: Supabase PostgreSQL" -ForegroundColor Green
Write-Host "  URL: $env:SPRING_DATASOURCE_URL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run Maven
mvn spring-boot:run

