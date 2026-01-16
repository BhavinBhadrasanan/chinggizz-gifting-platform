# ⚡ Cloudflare Pages - Quick Start

**5-Minute Deployment Guide**

---

## 🚀 Deploy in 5 Steps

### 1️⃣ Create Cloudflare Account
- Go to: https://dash.cloudflare.com/sign-up
- Sign up and verify email

### 2️⃣ Connect GitHub
- Dashboard → **Workers & Pages** → **Create application**
- Select **Pages** → **Connect to Git**
- Authorize GitHub → Select **chinggizz** repository

### 3️⃣ Configure Build

**Copy these exact settings:**

```
Project name: chinggizz-frontend
Production branch: main

Build settings:
  Framework preset: Vite
  Build command: npm run build
  Build output directory: dist
  Root directory: frontend
```

### 4️⃣ Add Environment Variable

**Click "Add environment variable":**

```
Name: VITE_API_BASE_URL
Value: https://your-backend-api.onrender.com/api
```

**Replace with your actual backend URL!**

### 5️⃣ Deploy

- Click **"Save and Deploy"**
- Wait 2-5 minutes
- Done! 🎉

**Your site:** `https://chinggizz-frontend.pages.dev`

---

## 🌐 Add Custom Domain (Optional)

1. **In your project:**
   - Custom domains → Set up a custom domain
   - Enter: `www.yourdomain.com`

2. **If domain on Cloudflare:**
   - Automatic DNS configuration ✅

3. **If domain elsewhere:**
   - Add CNAME record:
   ```
   Type: CNAME
   Name: www
   Target: chinggizz-frontend.pages.dev
   ```

---

## ✅ Verify Deployment

Test these:
- [ ] Homepage loads
- [ ] Products page works
- [ ] 3D hamper builder renders
- [ ] Cart functionality
- [ ] API calls work (check browser console)
- [ ] Routing works (try direct URLs)

---

## 🐛 Common Issues

**Build fails?**
- Add `NODE_VERSION=18` environment variable

**404 on routes?**
- Check `frontend/public/_redirects` exists
- Should contain: `/*    /index.html   200`

**API not working?**
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS allows your domain
- Check browser console for errors

---

## 📊 What You Get (FREE)

✅ Unlimited bandwidth  
✅ Unlimited builds (500/month)  
✅ Global CDN (275+ locations)  
✅ Free SSL certificate  
✅ DDoS protection  
✅ Automatic deployments  
✅ Preview deployments  
✅ Analytics  

**Cost: $0/month**

---

## 🔄 Auto-Deployment

**Every time you push to GitHub:**
- `main` branch → Production deployment
- Other branches → Preview deployment
- Pull requests → Automatic preview URL

**No manual deployment needed!**

---

## 📚 Full Documentation

See `CLOUDFLARE_DEPLOYMENT_GUIDE.md` for complete details.

---

**That's it! Your frontend is now on Cloudflare's global network!** 🚀☁️

