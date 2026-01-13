# Run Chinggizz Backend with Supabase Profile

# Clear any existing database environment variables
Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_USERNAME -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:SPRING_DATASOURCE_DRIVER_CLASS_NAME -ErrorAction SilentlyContinue

# Set Supabase environment variables (using pooler port 6543)
$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
$env:SUPABASE_DB_USERNAME="postgres.yzpgwxwhidheosuikeo"
$env:SUPABASE_DB_PASSWORD="Kunjichini@1827"

# Override Spring datasource directly (highest priority)
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
$env:SPRING_DATASOURCE_USERNAME="postgres.yzpgwxwhidheosuikeo"
$env:SPRING_DATASOURCE_PASSWORD="Kunjichini@1827"
$env:SPRING_DATASOURCE_DRIVER_CLASS_NAME="org.postgresql.Driver"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Chinggizz Backend Server" -ForegroundColor Cyan
Write-Host "  Profile: supabase" -ForegroundColor Green
Write-Host "  Database: Supabase PostgreSQL" -ForegroundColor Green
Write-Host "  URL: $env:SPRING_DATASOURCE_URL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run Maven
mvn spring-boot:run

