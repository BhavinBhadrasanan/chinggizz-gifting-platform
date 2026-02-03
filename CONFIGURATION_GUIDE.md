# 🔧 CHINGGIZZ CONFIGURATION GUIDE

## 📋 COMPLETE ENVIRONMENT CONFIGURATION

This guide covers ALL configuration for both **Local Development** and **Production (Render)**.

---

## 🏠 LOCAL DEVELOPMENT CONFIGURATION

### **Backend Configuration (Local)**

**File:** `run-local.bat`

```bash
# Database Connection (Supabase)
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0&connectTimeout=60&socketTimeout=60&tcpKeepAlive=true&ApplicationName=chinggizz-app
SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
SPRING_DATASOURCE_PASSWORD=Chinggizz098

# Application Settings
JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production-minimum-256-bits
ADMIN_PASSWORD=admin123
WHATSAPP_NUMBER=7012897008
UPLOAD_DIR=uploads/products
HIBERNATE_DDL_AUTO=validate
LOG_LEVEL=INFO
SHOW_SQL=false
```

**Admin Credentials (Local):**
- Username: `admin`
- Password: `admin123`

**Database:** Supabase PostgreSQL (Port 6543 - Transaction Pooler)

---

### **Frontend Configuration (Local)**

**File:** `frontend/.env` (create from template)

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

**How to create:**
```bash
cd frontend
copy .env.template .env
# Edit .env and set: VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🚀 PRODUCTION CONFIGURATION (RENDER)

### **Backend Configuration (Render)**

**Location:** Render Dashboard → Environment Variables

```bash
# Database Connection (Supabase)
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0&connectTimeout=60&socketTimeout=60&tcpKeepAlive=true&ApplicationName=chinggizz-app
SPRING_DATASOURCE_USERNAME=postgres.pzgnowrxbiefhxsoukxc
SPRING_DATASOURCE_PASSWORD=Chinggizz098

# Application Settings
JWT_SECRET=TNLAcqVe1oNcdRiFi2YA9amfTJzKutvhuFaUvAkrkhyvY0PThehqoDmqczOLqr769F
ADMIN_PASSWORD=Chinggizz2028
WHATSAPP_NUMBER=7012897008
UPLOAD_DIR=/app/uploads/products
HIBERNATE_DDL_AUTO=validate
```

**Admin Credentials (Production):**
- Username: `admin`
- Password: `Chinggizz2028` ⚠️ **DIFFERENT FROM LOCAL!**

**Database:** Supabase PostgreSQL (Port 6543 - Transaction Pooler)

---

### **Frontend Configuration (Production)**

**File:** `frontend/.env.production` (already configured)

```bash
VITE_API_BASE_URL=https://chinggizz-gifting-platform.onrender.com/api
```

**Deployment:** Cloudflare Pages / Netlify
- Automatically uses `.env.production` during build
- No manual configuration needed

---

## 🔐 SECURITY COMPARISON

| Setting | Local | Production | Notes |
|---------|-------|------------|-------|
| **Admin Password** | `admin123` | `Chinggizz2028` | ⚠️ DIFFERENT! |
| **Database Password** | `Chinggizz098` | `Chinggizz098` | ✅ Same |
| **JWT Secret** | Short dev key | Long production key | ⚠️ DIFFERENT! |
| **Database Port** | 6543 | 6543 | ✅ Same (Transaction Pooler) |
| **Upload Directory** | `uploads/products` | `/app/uploads/products` | Different paths |

---

## 📂 FILE STRUCTURE

```
chinggizz/
├── src/main/resources/
│   └── application.yml          # Main config (uses env variables)
├── frontend/
│   ├── .env.template            # Template for local .env
│   ├── .env                     # Local development (create manually)
│   └── .env.production          # Production build (committed)
├── run-local.bat                # Local backend startup
├── run-frontend.bat             # Local frontend startup
├── run-full-stack.bat           # Run both locally
└── Dockerfile                   # Production Docker build
```

---

## ✅ CONFIGURATION VALIDATION CHECKLIST

### **Local Development:**
- [ ] `run-local.bat` sets all environment variables
- [ ] `frontend/.env` exists with `VITE_API_BASE_URL=http://localhost:8080/api`
- [ ] Backend connects to Supabase on port 6543
- [ ] Admin login works with `admin` / `admin123`
- [ ] Frontend connects to `http://localhost:8080/api`

### **Production (Render):**
- [ ] All environment variables set in Render Dashboard
- [ ] `ADMIN_PASSWORD=Chinggizz2028` (NOT admin123)
- [ ] `SPRING_DATASOURCE_URL` uses port 6543
- [ ] `JWT_SECRET` is production-grade (long and secure)
- [ ] `HIBERNATE_DDL_AUTO=validate` (prevents accidental schema changes)
- [ ] `frontend/.env.production` points to Render backend URL

---

## 🚨 COMMON MISTAKES TO AVOID

1. ❌ **Using `admin123` in production** → Use `Chinggizz2028`
2. ❌ **Using port 5432 instead of 6543** → Always use 6543 (Transaction Pooler)
3. ❌ **Forgetting to create `frontend/.env`** → Copy from `.env.template`
4. ❌ **Committing `.env` to Git** → Already in `.gitignore`
5. ❌ **Using local JWT secret in production** → Use long secure key

---

## 🔄 SWITCHING BETWEEN ENVIRONMENTS

### **To Run Locally:**
```bash
# Backend
run-local.bat

# Frontend (separate terminal)
run-frontend.bat

# Or run both together
run-full-stack.bat
```

### **To Deploy to Production:**
```bash
# Backend (Render)
git push origin main
# Render auto-deploys from GitHub

# Frontend (Cloudflare Pages)
cd frontend
npm run build
# Deploy dist/ folder to Cloudflare Pages
```

---

## 📊 ENVIRONMENT VARIABLE SOURCES

| Environment | Backend Config | Frontend Config |
|-------------|----------------|-----------------|
| **Local** | `run-local.bat` | `frontend/.env` |
| **Production** | Render Dashboard | `frontend/.env.production` |
| **Fallback** | `application.yml` defaults | `vite.config.js` proxy |

---

## 🎯 QUICK REFERENCE

**Local URLs:**
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin/login

**Production URLs:**
- Backend: https://chinggizz-gifting-platform.onrender.com
- Frontend: (Your Cloudflare Pages URL)
- Admin: (Your Cloudflare Pages URL)/admin/login

---

**Last Updated:** 2026-02-02

