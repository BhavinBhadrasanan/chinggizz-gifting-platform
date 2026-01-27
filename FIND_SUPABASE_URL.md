# 🔍 How to Find Supabase Connection URL - Step by Step

## 📸 Visual Guide with Screenshots

### **Step 1: Login to Supabase**
```
🌐 URL: https://supabase.com/dashboard
```

---

### **Step 2: Select Your Project**
```
Click on: "Chinggizz" project (or your project name)
```

---

### **Step 3: Open Settings**
```
Location: Bottom left sidebar
Icon: ⚙️ Settings
Click: Settings
```

---

### **Step 4: Click Database**
```
In Settings menu, click: Database
```

---

### **Step 5: Scroll to "Connection String"**
```
Scroll down the page until you see:
┌─────────────────────────────────────────┐
│  Connection String                      │
├─────────────────────────────────────────┤
│  Connection pooling                     │
│  ✅ Recommended for production          │
│                                         │
│  URI:                                   │
│  postgresql://postgres.xxx:pwd@...     │
│  :6543/postgres                         │
│                                         │
│  JDBC:                                  │
│  jdbc:postgresql://...                  │
│  :6543/postgres                         │
└─────────────────────────────────────────┘
```

---

### **Step 6: Copy the JDBC URL**
```
Look for the section labeled "JDBC"
You'll see something like:

jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres

👆 This is what you need!
```

---

## 🎯 What You're Looking For

### **Connection Pooling Section (Port 6543)**
```yaml
Host: aws-1-ap-south-1.pooler.supabase.com
Port: 6543  # ← This is the key difference!
Database: postgres
Mode: Transaction
```

### **Direct Connection Section (Port 5432)**
```yaml
Host: aws-1-ap-south-1.pooler.supabase.com
Port: 5432  # ← Direct connection
Database: postgres
Mode: Session
```

---

## ✅ For Render Deployment - Use This:

### **Complete JDBC URL:**
```
jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
```

### **Breakdown:**
- `jdbc:postgresql://` - JDBC protocol
- `aws-1-ap-south-1.pooler.supabase.com` - Supabase host
- `:6543` - **Connection pooler port** (NOT 5432)
- `/postgres` - Database name
- `?sslmode=require` - SSL required
- `&prepareThreshold=0` - PgBouncer compatibility

---

## 🔐 Username and Password

### **Username Format:**
```
postgres.[your-project-ref]

Example:
postgres.pzgnowrxbiefhxsoukxc
```

### **Password:**
```
Find in: Supabase Dashboard → Settings → Database
Look for: "Database password" section
Note: This is the password you set when creating the project
```

---

## 🚀 Quick Test - Verify Your Connection

### **Test 1: Check if Port is Open**
Open terminal and run:
```bash
# Test Connection Pooler (Port 6543)
telnet aws-1-ap-south-1.pooler.supabase.com 6543

# Expected: Connection successful
```

### **Test 2: Test with psql (if installed)**
```bash
psql "postgresql://postgres.pzgnowrxbiefhxsoukxc:YOUR_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"

# Expected: PostgreSQL prompt
```

---

## 📋 Checklist - Before Setting in Render

- [ ] Found connection string in Supabase Dashboard
- [ ] Verified port is **6543** (connection pooling)
- [ ] Copied JDBC format URL
- [ ] Have username: `postgres.pzgnowrxbiefhxsoukxc`
- [ ] Have password: `Chinggizz098`
- [ ] Added `sslmode=require` parameter
- [ ] Added `prepareThreshold=0` parameter

---

## 🎯 Final Environment Variables for Render

Copy these to Render Dashboard → Environment:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
SPRING_DATASOURCE_PASSWORD=Chinggizz098
JWT_SECRET=chinggizz-super-secret-jwt-key-minimum-256-bits-long-change-in-production-2026-secure-token
ADMIN_PASSWORD=Admin@Chinggizz2026
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ **Wrong Port**
```
jdbc:postgresql://...supabase.com:5432/postgres
                                   ^^^^
                                   Should be 6543 for production!
```

### ❌ **Missing prepareThreshold**
```
jdbc:postgresql://...supabase.com:6543/postgres?sslmode=require
                                                 ^^^^^^^^^^^^^^^
                                                 Add: &prepareThreshold=0
```

### ❌ **Wrong Username Format**
```
Username: postgres  ❌ WRONG
Username: postgres.pzgnowrxbiefhxsoukxc  ✅ CORRECT
```

---

## 🆘 Troubleshooting

### **Can't Find Connection String Section?**
1. Make sure you're in **Settings** → **Database**
2. Scroll down past "Database Settings"
3. Look for "Connection String" heading
4. Should see both "Connection pooling" and "Direct connection"

### **Connection String Shows Different Host?**
- This is normal - each project has a unique host
- Use the host shown in YOUR Supabase dashboard
- Format: `aws-[region].pooler.supabase.com`

### **Don't Remember Database Password?**
1. Go to Settings → Database
2. Click "Reset database password"
3. Copy the new password
4. Update in Render environment variables

---

## ✅ Success Indicators

After setting correct connection URL in Render, you should see:

```
✅ HikariPool-1 - Starting...
✅ HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
✅ HikariPool-1 - Start completed.
✅ Started ChinggizzApplication
```

No more:
```
❌ java.net.SocketTimeoutException: Connect timed out
❌ Failed to bind properties under 'spring.datasource.hikari.connection'
```

