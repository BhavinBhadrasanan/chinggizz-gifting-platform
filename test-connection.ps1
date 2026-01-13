Write-Host "Testing Supabase Connection..." -ForegroundColor Cyan

# Test with psql if available
$host = "aws-1-ap-south-1.pooler.supabase.com"
$port = 5432
$database = "postgres"
$username = "postgres.pyzgqowrxbtefhxsaukxc"
$password = "Kunjichini@1827"

Write-Host "`nConnection Details:" -ForegroundColor Yellow
Write-Host "Host: $host"
Write-Host "Port: $port"
Write-Host "Database: $database"
Write-Host "Username: $username"
Write-Host "Password: [HIDDEN]"

# Test TCP connection
Write-Host "`nTesting TCP connection..." -ForegroundColor Cyan
Test-NetConnection -ComputerName $host -Port $port

# Try to connect with Java
Write-Host "`nTesting JDBC connection..." -ForegroundColor Cyan
$env:PGPASSWORD = $password

# Create a simple Java test
$javaTest = @"
import java.sql.*;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
        String user = "postgres.pyzgqowrxbtefhxsaukxc";
        String password = "Kunjichini@1827";
        
        System.out.println("Attempting to connect to: " + url);
        System.out.println("Username: " + user);
        
        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✓ Connection successful!");
            System.out.println("Database: " + conn.getCatalog());
            conn.close();
        } catch (Exception e) {
            System.out.println("✗ Connection failed!");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
"@

Set-Content -Path "TestConnection.java" -Value $javaTest

Write-Host "`nCompiling Java test..." -ForegroundColor Cyan
javac TestConnection.java

if ($LASTEXITCODE -eq 0) {
    Write-Host "Running Java connection test..." -ForegroundColor Cyan
    java -cp ".;target/classes/*" TestConnection
} else {
    Write-Host "Compilation failed!" -ForegroundColor Red
}

# Cleanup
Remove-Item TestConnection.java -ErrorAction SilentlyContinue
Remove-Item TestConnection.class -ErrorAction SilentlyContinue

