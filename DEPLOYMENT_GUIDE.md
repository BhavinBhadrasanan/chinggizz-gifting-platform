# 🚀 Deployment Guide - Netlify & Render

Complete step-by-step guide to deploy Chinggizz to production.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (free tier available)
- ✅ Render account (free tier available)
- ✅ Supabase database already set up
- ✅ Code pushed to GitHub repository

---

## 🎯 Deployment Overview

```
Frontend (React) → Netlify
Backend (Spring Boot) → Render
Database (PostgreSQL) → Supabase
```

---

## 📦 PART 1: Push Code to GitHub

### Step 1: Check Git Status

```bash
# Navigate to project root
cd F:/citrus_Projects/citusHealth/chinggizz

# Check git status
git status
```

### Step 2: Stage and Commit

```bash
# Add all files
git add .

# Check what will be committed
git status

# Commit
git commit -m "Initial commit: Chinggizz Gift Platform"
```

### Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click **"+"** → **"New repository"**
3. Repository name: `chinggizz-gift-platform`
4. Description: "Custom Gift Hamper Platform with 3D Builder"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README (we already have code)
7. Click **"Create repository"**

### Step 4: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/chinggizz-gift-platform.git

# Verify remote
git remote -v

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🔧 PART 2: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select repository: `chinggizz-gift-platform`

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `chinggizz-backend`
- **Environment**: `Java`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build Settings:**
- **Build Command**: `./mvnw clean install -DskipTests`
- **Start Command**: `java -jar target/chinggizz-app-1.0.0.jar`

**Instance Type:**
- Choose **Free** (or paid for better performance)

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
SPRING_PROFILES_ACTIVE = supabase

SPRING_DATASOURCE_URL = jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres

SPRING_DATASOURCE_USERNAME = postgres

SPRING_DATASOURCE_PASSWORD = your-supabase-password

JWT_SECRET = your-super-secret-jwt-key-minimum-256-bits-long

FILE_UPLOAD_DIR = /opt/render/project/src/uploads/products
```

**How to get Supabase credentials:**
1. Go to Supabase Dashboard
2. Settings → Database
3. Copy connection string details

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. **Copy the deployed URL**: `https://chinggizz-backend.onrender.com`

### Step 5: Test Backend

```bash
# Test API endpoint
curl https://chinggizz-backend.onrender.com/api/categories
```

Should return JSON with categories.

---

## 🎨 PART 3: Deploy Frontend to Netlify

### Step 1: Create Production Environment File

**Create `frontend/.env.production`:**

```env
VITE_API_BASE_URL=https://chinggizz-backend.onrender.com/api
```

**Commit and push:**

```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

### Step 2: Deploy via Netlify Dashboard

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access GitHub
5. Select repository: `chinggizz-gift-platform`

### Step 3: Configure Build Settings

**Build Settings:**
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

**Environment Variables:**
Click **"Show advanced"** → **"New variable"**

```
VITE_API_BASE_URL = https://chinggizz-backend.onrender.com/api
```

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for deployment (2-5 minutes)
3. **Copy the site URL**: `https://random-name-12345.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

---

## 🔒 PART 4: Configure CORS

### Update Backend CORS Configuration

**File: `src/main/java/com/chinggizz/config/WebConfig.java`**

Find `addCorsMappings` method and update:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://random-name-12345.netlify.app",  // Your Netlify URL
                "https://your-custom-domain.com"          // If you have one
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

**Commit and push:**

```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy.

---

## ✅ PART 5: Verification

### Frontend Checklist
- [ ] Site loads at Netlify URL
- [ ] No console errors in browser (F12)
- [ ] Products load from API
- [ ] 3D hamper builder works
- [ ] Images display correctly
- [ ] Cart functionality works

### Backend Checklist
- [ ] Service shows "Live" status in Render
- [ ] API responds: `/api/categories`
- [ ] Database connection works
- [ ] CORS allows frontend domain
- [ ] File uploads work (if applicable)

### Test Full Flow
1. Browse products
2. Add items to cart
3. Build custom hamper
4. Place order
5. Check admin login

---

## 🎉 You're Live!

**Frontend**: https://your-site.netlify.app  
**Backend**: https://chinggizz-backend.onrender.com  
**Admin**: https://your-site.netlify.app/admin

---

## 📝 Future Updates

### To Deploy Updates:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Both Netlify and Render will **automatically redeploy**! 🚀

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free:**
- Spins down after 15 min inactivity
- First request takes ~30 seconds (cold start)
- 750 hours/month

**Netlify Free:**
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**Supabase Free:**
- 500MB database
- 2GB bandwidth/month
- Pauses after 7 days inactivity

### Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Rotate JWT secrets regularly
- ✅ Use strong database passwords
- ✅ Enable HTTPS (automatic on Netlify/Render)

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify Supabase database is accessible
- Check Render logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration
- Test backend URL directly in browser

### Database connection fails
- Verify Supabase credentials
- Check if database is paused (free tier)
- Test connection from Render logs

---

## 📞 Support

If you encounter issues:
1. Check Render/Netlify logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

---

**Happy Deploying! 🚀**

