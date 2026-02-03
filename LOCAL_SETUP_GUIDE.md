# 🚀 CHINGGIZZ LOCAL SETUP GUIDE

## ✅ PREREQUISITES

Before running locally, ensure you have:

- ✅ **Java 17+** installed (`java -version`)
- ✅ **Maven 3.6+** installed (`mvn -version`)
- ✅ **Node.js 18+** installed (`node -version`)
- ✅ **npm** installed (`npm -version`)
- ✅ **Supabase account** with database setup

---

## 📋 STEP-BY-STEP LOCAL SETUP

### **STEP 1: Run Migration Script in Supabase**

1. **Open Supabase Dashboard:**
   - Go to https://supabase.com
   - Select your project: `chinggizz-gifting-platform`

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Run Migration Script:**
   - Open file: `database/PRODUCTION_DEPLOYMENT_MIGRATION.sql`
   - Copy entire content
   - Paste into Supabase SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Success:**
   - You should see messages like:
     ```
     ✅ Column specifications added to products table
     ✅ Column additional_images added to products table
     ✅ All columns verified successfully
     ```

---

### **STEP 2: Verify Database Connection**

Your `application.yml` is already configured with Supabase credentials:

```yaml
datasource:
  url: jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres
  username: postgres.pzgnowrxbiefhxsoukxc
  password: Chinggizz098
```

**✅ No changes needed for local development!**

---

### **STEP 3: Run Backend (Spring Boot)**

**Option A: Run Backend Only**
```bash
run-local.bat
```

**Option B: Run Full Stack (Backend + Frontend)**
```bash
run-full-stack.bat
```

**What happens:**
- Maven cleans previous build
- Spring Boot starts on port **8080**
- Backend API available at: `http://localhost:8080/api`
- Admin login: `admin` / `admin123`

---

### **STEP 4: Run Frontend (React + Vite)**

**If you used Option B above, skip this step!**

**Run Frontend Only:**
```bash
run-frontend.bat
```

**What happens:**
- npm installs dependencies (if needed)
- Vite dev server starts on port **5173**
- Frontend available at: `http://localhost:5173`
- Auto-connects to backend at `http://localhost:8080/api`

---

## 🎯 QUICK START COMMANDS

### **Run Everything (Recommended)**
```bash
run-full-stack.bat
```
This opens 2 windows:
- Window 1: Backend (Spring Boot)
- Window 2: Frontend (Vite)

### **Run Backend Only**
```bash
run-local.bat
```

### **Run Frontend Only**
```bash
run-frontend.bat
```

---

## 🔍 VERIFY EVERYTHING IS WORKING

### **1. Check Backend Health**
Open browser: http://localhost:8080/api/health

Expected response:
```json
{
  "status": "UP"
}
```

### **2. Check Frontend**
Open browser: http://localhost:5173

You should see the Chinggizz homepage

### **3. Test Admin Login**
1. Go to: http://localhost:5173/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You should see the admin dashboard

---

## 🛠️ TROUBLESHOOTING

### **Backend Issues**

**Problem: Port 8080 already in use**
```
Error: Port 8080 is already in use
```
**Solution:**
- Kill the process using port 8080
- Or change port in `application.yml`: `server.port: 8081`

**Problem: Database connection failed**
```
FATAL: Tenant or user not found
```
**Solution:**
- Verify Supabase credentials in `application.yml`
- Check if Supabase database is running
- Verify migration script was executed

**Problem: Missing columns error**
```
ERROR: column "specifications" does not exist
```
**Solution:**
- Run migration script in Supabase (Step 1)
- Restart backend

### **Frontend Issues**

**Problem: Cannot connect to backend**
```
Network Error: ERR_CONNECTION_REFUSED
```
**Solution:**
- Ensure backend is running on port 8080
- Check `frontend/src/config/api.js` has correct URL

**Problem: npm install fails**
```
npm ERR! code ERESOLVE
```
**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
```

---

## 📊 LOCAL ENVIRONMENT VARIABLES

Backend uses these environment variables (already set in `run-local.bat`):

```bash
JWT_SECRET=chinggizz-local-dev-secret-key-not-for-production-minimum-256-bits
ADMIN_PASSWORD=admin123
WHATSAPP_NUMBER=7012897008
UPLOAD_DIR=uploads/products
HIBERNATE_DDL_AUTO=validate
```

Frontend uses these (set in `vite.config.js`):

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Migration script executed in Supabase
- [ ] Backend starts without errors
- [ ] Backend health check returns `{"status": "UP"}`
- [ ] Frontend starts on port 5173
- [ ] Can access homepage at http://localhost:5173
- [ ] Can login to admin at http://localhost:5173/admin/login
- [ ] Can view products
- [ ] Can add products to cart

---

## 🎉 YOU'RE READY!

Once all checks pass, you're ready to develop locally!

**Next Steps:**
1. Make your code changes
2. Test locally
3. Commit changes
4. Deploy to Render (production)

