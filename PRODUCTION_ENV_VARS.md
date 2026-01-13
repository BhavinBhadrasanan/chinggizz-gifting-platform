# 🔐 Production Environment Variables - REQUIRED

## ⚠️ CRITICAL: These MUST be set in Render for production deployment

### 1. Database Configuration (REQUIRED)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require&connectTimeout=60&socketTimeout=60&loginTimeout=60

SPRING_DATASOURCE_USERNAME=postgres.pyzgqowrxbtefhxsaukxc

SPRING_DATASOURCE_PASSWORD=Chinggizz098
```

### 2. Security Configuration (REQUIRED)
```
JWT_SECRET=<GENERATE_A_STRONG_SECRET_HERE>
```

**How to generate a strong JWT secret:**
```bash
# Option 1: Using OpenSSL (recommended)
openssl rand -base64 64

# Option 2: Using PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Example strong secret:**
```
JWT_SECRET=Xk7mP9qR2sT5vW8yZ1aC4dF6gH9jK0lN3oQ5rU7wX0zA2bD4eG6hJ8kM1nP3qS5tV7xY9zA1bC3dE5fG7hI9jK
```

### 3. Admin Configuration (REQUIRED)
```
ADMIN_PASSWORD=<STRONG_PASSWORD_HERE>
```

**⚠️ DO NOT use "admin123" in production!**

**Example strong password:**
```
ADMIN_PASSWORD=Ch1ngg1zz@2024!Pr0d#Secur3
```

### 4. Optional Configuration
```
# WhatsApp Business Number
WHATSAPP_NUMBER=7012897008

# Admin Username (default: admin)
ADMIN_USERNAME=admin

# JWT Token Expiration (default: 24 hours)
JWT_EXPIRATION=86400000

# File Upload Directory
UPLOAD_DIR=uploads/products

# Port (Render sets this automatically)
PORT=8080
```

---

## 📋 Complete Render Environment Variables Setup

**Go to: Render Dashboard → Your Service → Environment**

**Add these variables:**

| Variable Name | Value | Required |
|--------------|-------|----------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require&connectTimeout=60&socketTimeout=60&loginTimeout=60` | ✅ YES |
| `SPRING_DATASOURCE_USERNAME` | `postgres.pyzgqowrxbtefhxsaukxc` | ✅ YES |
| `SPRING_DATASOURCE_PASSWORD` | `Chinggizz098` | ✅ YES |
| `JWT_SECRET` | `<YOUR_STRONG_SECRET>` | ✅ YES |
| `ADMIN_PASSWORD` | `<YOUR_STRONG_PASSWORD>` | ✅ YES |
| `WHATSAPP_NUMBER` | `7012897008` | ⚪ Optional |
| `ADMIN_USERNAME` | `admin` | ⚪ Optional |

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use strong, randomly generated JWT secret (64+ characters)
- ✅ Use strong admin password (12+ characters, mixed case, numbers, symbols)
- ✅ Keep secrets in Render environment variables only
- ✅ Never commit secrets to Git
- ✅ Rotate secrets periodically

### ❌ DON'T:
- ❌ Use default passwords in production
- ❌ Use simple/predictable secrets
- ❌ Share secrets in chat/email
- ❌ Commit secrets to version control
- ❌ Use the same secrets for dev and production

---

## 🎯 What Changed for Production Security

### Before (Insecure):
```yaml
jwt:
  secret: chinggizz-super-secret-key-change-in-production-2024  # ❌ Weak
admin:
  default-password: admin123  # ❌ Very weak
logging:
  level:
    com.chinggizz: DEBUG  # ❌ Too verbose
    org.hibernate.SQL: DEBUG  # ❌ Exposes queries
```

### After (Secure):
```yaml
jwt:
  secret: ${JWT_SECRET}  # ✅ Must be set in environment
admin:
  default-password: ${ADMIN_PASSWORD}  # ✅ Must be set in environment
logging:
  level:
    com.chinggizz: INFO  # ✅ Production level
    org.hibernate.SQL: WARN  # ✅ No query exposure
```

---

## 🧪 Local Development vs Production

### Local Development (application-local.yml):
- ✅ Debug logging enabled
- ✅ SQL queries shown
- ✅ Error details exposed
- ✅ Weak secrets OK (for testing only)

### Production (application.yml):
- ✅ INFO/WARN logging only
- ✅ SQL queries hidden
- ✅ Error details hidden
- ✅ Strong secrets REQUIRED

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Generate strong JWT secret (64+ characters)
- [ ] Set strong admin password (12+ characters)
- [ ] Add all required environment variables in Render
- [ ] Verify database credentials are correct
- [ ] Test locally with production-like settings
- [ ] Push code to GitHub
- [ ] Monitor Render deployment logs
- [ ] Test deployed application
- [ ] Verify admin login works
- [ ] Check API endpoints respond correctly

---

## 🔧 How to Test Locally with Production Settings

If you want to test with production-like settings locally:

```powershell
# Set production-like environment variables
$env:SPRING_PROFILES_ACTIVE="default"  # Use default profile (production settings)
$env:JWT_SECRET="your-test-secret-here"
$env:ADMIN_PASSWORD="your-test-password-here"

# Run the application
mvn spring-boot:run
```

---

## ⚡ Quick Setup Commands

### Generate JWT Secret:
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Copy to Clipboard:
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 })) | Set-Clipboard
```

---

**Remember:** Production security is critical. Never use default/weak passwords!

