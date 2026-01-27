# 🔗 Supabase Connection URL Guide

## 📍 How to Find Your Connection URL

### **Step 1: Open Supabase Dashboard**
1. Go to: https://supabase.com/dashboard
2. Login with your account
3. Click on your **Chinggizz** project

### **Step 2: Navigate to Database Settings**
1. Click **⚙️ Settings** (bottom left sidebar)
2. Click **Database** (in the settings menu)
3. Scroll down to **"Connection String"** section

---

## 🔌 Connection String Options

### **Option 1: Connection Pooling (RECOMMENDED for Render)**

**When to use:**
- ✅ Production deployment (Render, Heroku, etc.)
- ✅ High traffic applications
- ✅ Multiple concurrent connections
- ✅ Serverless environments

**Connection Details:**
```
Host: aws-1-ap-south-1.pooler.supabase.com
Port: 6543
Database: postgres
Username: postgres.pzgnowrxbiefhxsoukxc
Password: [Your password from Supabase]
```

**Full JDBC URL:**
```
jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
```

**Why prepareThreshold=0?**
- Required for PgBouncer compatibility
- Prevents prepared statement caching issues

---

### **Option 2: Direct Connection**

**When to use:**
- ✅ Local development
- ✅ Database migrations
- ✅ Admin tasks
- ⚠️ NOT recommended for production

**Connection Details:**
```
Host: aws-1-ap-south-1.pooler.supabase.com
Port: 5432
Database: postgres
Username: postgres.pzgnowrxbiefhxsoukxc
Password: [Your password from Supabase]
```

**Full JDBC URL:**
```
jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```

---

## 🎯 For Your Render Deployment

### **Use These Environment Variables:**

```bash
# Connection Pooling (Port 6543)
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
SPRING_DATASOURCE_PASSWORD=Chinggizz098
```

---

## 🔍 How to Verify Connection String

### **Method 1: Check in Supabase Dashboard**
1. Settings → Database → Connection String
2. Look for **"Connection pooling"** section
3. Copy the **JDBC** format URL
4. Note the **port number** (should be 6543)

### **Method 2: Test Connection Locally**

Create a test file `test-connection.sh`:
```bash
#!/bin/bash
# Test Supabase connection

echo "Testing Connection Pooler (Port 6543)..."
curl -v telnet://aws-1-ap-south-1.pooler.supabase.com:6543

echo "Testing Direct Connection (Port 5432)..."
curl -v telnet://aws-1-ap-south-1.pooler.supabase.com:5432
```

---

## ⚠️ Common Issues

### **Issue 1: Connection Timeout**
**Symptom:** `java.net.SocketTimeoutException: Connect timed out`

**Solutions:**
- ✅ Use port **6543** (connection pooler)
- ✅ Add `prepareThreshold=0` parameter
- ✅ Check Supabase project is **ACTIVE** (not paused)
- ✅ Verify connection pooling is **ENABLED** in Supabase

### **Issue 2: Authentication Failed**
**Symptom:** `FATAL: password authentication failed`

**Solutions:**
- ✅ Verify password in Supabase Settings → Database
- ✅ Check username format: `postgres.[project-ref]`
- ✅ Reset database password if needed

### **Issue 3: SSL Required**
**Symptom:** `SSL connection required`

**Solutions:**
- ✅ Add `sslmode=require` to connection URL
- ✅ Ensure JDBC URL includes SSL parameter

---

## 🚀 Quick Copy-Paste for Render

### **Complete Environment Variables:**
```bash
# Database Connection (Connection Pooler)
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
SPRING_DATASOURCE_PASSWORD=Chinggizz098

# JWT Configuration
JWT_SECRET=chinggizz-super-secret-jwt-key-minimum-256-bits-long-change-in-production-2026-secure-token
ADMIN_PASSWORD=Admin@Chinggizz2026

# Optional
ADMIN_USERNAME=admin
JWT_EXPIRATION=86400000
WHATSAPP_NUMBER=7012897008
```

---

## 📝 Notes

1. **Never commit passwords** to Git
2. **Use environment variables** for all sensitive data
3. **Connection pooling** is recommended for production
4. **Direct connection** has a limit of ~60 connections
5. **Pooler connection** can handle 1000+ connections

---

## 🆘 Still Having Issues?

1. Check Supabase project status (not paused)
2. Verify network connectivity to Supabase
3. Check Render logs for specific error messages
4. Try both port 6543 and 5432 to see which works

