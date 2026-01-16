# ☁️ Cloudflare Pages Deployment Guide

Complete guide to deploy Chinggizz Frontend on Cloudflare Pages.

---

## 📋 Prerequisites

- ✅ Cloudflare account (free tier is sufficient)
- ✅ GitHub repository access
- ✅ Backend API deployed (Render/other)
- ✅ Domain name (optional)

---

## 🚀 Quick Start Deployment

### Step 1: Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify your email address
4. Complete account setup

### Step 2: Connect GitHub Repository

1. **Navigate to Pages:**
   - Login to Cloudflare Dashboard
   - Click **"Workers & Pages"** in sidebar
   - Click **"Create application"**
   - Select **"Pages"** tab
   - Click **"Connect to Git"**

2. **Authorize GitHub:**
   - Click **"Connect GitHub"**
   - Authorize Cloudflare Pages
   - Select repositories to grant access
   - Choose **"chinggizz"** repository

### Step 3: Configure Build Settings

**Project Configuration:**

```yaml
Project name: chinggizz-frontend
Production branch: main
```

**Build Settings:**

```yaml
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: frontend
Node version: 18
```

**Important:** Make sure to set **Root directory** to `frontend` since your React app is in a subdirectory!

### Step 4: Environment Variables

Click **"Add environment variable"** and add:

```bash
# Required - Your Backend API URL
VITE_API_BASE_URL=https://your-backend-api.onrender.com/api

# Optional - Node Version
NODE_VERSION=18
```

**Note:** Replace `your-backend-api.onrender.com` with your actual backend URL!

### Step 5: Deploy

1. Click **"Save and Deploy"**
2. Wait 2-5 minutes for build to complete
3. Your site will be live at: `https://chinggizz-frontend.pages.dev`

---

## 🌐 Custom Domain Setup

### Option 1: Domain Already on Cloudflare

1. **In Pages Dashboard:**
   - Go to your project
   - Click **"Custom domains"**
   - Click **"Set up a custom domain"**
   - Enter: `www.yourdomain.com`
   - Click **"Continue"**

2. **DNS Auto-Configuration:**
   - Cloudflare will automatically add CNAME record
   - SSL certificate will be provisioned automatically
   - Wait 1-5 minutes for activation

### Option 2: Domain on Another Provider

1. **Add Custom Domain in Cloudflare:**
   - Follow same steps as Option 1
   - Copy the CNAME target provided

2. **Update DNS at Your Provider:**
   ```
   Type: CNAME
   Name: www
   Target: chinggizz-frontend.pages.dev
   TTL: Auto or 3600
   ```

3. **Wait for DNS Propagation:**
   - Usually 5-30 minutes
   - Can take up to 24 hours

---

## 🔧 Build Configuration Details

### Build Command Breakdown

The build process runs these commands:

```bash
cd frontend          # Navigate to frontend directory
npm install          # Install dependencies
npm run build        # Build production bundle (Vite)
```

### Output Directory

Vite builds to `frontend/dist/` with this structure:

```
frontend/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [static files from public/]
```

---

## 📊 Monitoring & Analytics

### Built-in Analytics

Cloudflare Pages provides free analytics:

1. **Go to your project**
2. Click **"Analytics"** tab
3. View:
   - Requests per day
   - Bandwidth usage
   - Unique visitors
   - Geographic distribution
   - Top pages

### Web Analytics (Optional)

For more detailed analytics:

1. **Enable Web Analytics:**
   - Dashboard → Analytics → Web Analytics
   - Click **"Add a site"**
   - Enter your domain
   - Copy the tracking code

2. **Add to index.html:**
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
           data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
   ```

---

## 🔐 Security Configuration

### Automatic Security Features

Cloudflare Pages includes:
- ✅ Free SSL/TLS certificates
- ✅ DDoS protection
- ✅ WAF (Web Application Firewall)
- ✅ Bot protection
- ✅ Always HTTPS

### Custom Security Headers

Already configured in `frontend/public/_headers`:
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- Referrer-Policy

---

## ⚡ Performance Optimization

### Cloudflare Features to Enable

1. **Go to your domain in Cloudflare Dashboard**

2. **Speed → Optimization:**
   - ✅ Auto Minify (HTML, CSS, JS)
   - ✅ Brotli compression
   - ✅ Early Hints
   - ✅ HTTP/3 (QUIC)

3. **Caching → Configuration:**
   - ✅ Browser Cache TTL: 4 hours
   - ✅ Always Online: Enabled

4. **Network:**
   - ✅ HTTP/2: Enabled
   - ✅ HTTP/3: Enabled
   - ✅ WebSockets: Enabled

---

## 🔄 Continuous Deployment

### Automatic Deployments

Cloudflare Pages automatically deploys:

**Production Deployments:**
- Triggered by: Push to `main` branch
- URL: `https://chinggizz-frontend.pages.dev`
- Custom domain: `https://www.yourdomain.com`

**Preview Deployments:**
- Triggered by: Push to any other branch
- URL: `https://[branch].[project].pages.dev`
- Perfect for testing before merging!

**Pull Request Previews:**
- Triggered by: Opening a PR
- URL: `https://[pr-number].[project].pages.dev`
- Automatic comment on PR with preview link

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command not found: npm"**
- Solution: Add `NODE_VERSION=18` environment variable

**Error: "Cannot find module"**
- Solution: Check `package.json` dependencies
- Run `npm install` locally to verify

**Error: "Build exceeded time limit"**
- Solution: Optimize build process
- Remove unused dependencies

### Routing Issues

**404 on Direct URLs**
- Solution: Verify `_redirects` file exists in `public/`
- Content should be: `/*    /index.html   200`

**API Calls Failing**
- Solution: Check `VITE_API_BASE_URL` environment variable
- Verify CORS settings on backend
- Check browser console for errors

### Performance Issues

**Slow Load Times**
- Solution: Enable Cloudflare optimizations
- Check image sizes and optimize
- Enable caching headers

---

## 📝 Environment Variables Reference

### Required Variables

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Optional Variables

```bash
NODE_VERSION=18
NPM_VERSION=9
VITE_ENABLE_ANALYTICS=true
```

### Setting Environment Variables

1. **Production Environment:**
   - Pages Dashboard → Settings → Environment variables
   - Select "Production" environment
   - Add variables

2. **Preview Environment:**
   - Same location
   - Select "Preview" environment
   - Can use different values for testing

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at `.pages.dev` URL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (green padlock)
- [ ] All pages load correctly
- [ ] React Router works (test direct URLs)
- [ ] API calls successful
- [ ] 3D hamper builder renders
- [ ] Images load properly
- [ ] Cart functionality works
- [ ] Mobile responsive
- [ ] Analytics configured

---

## 🔗 Useful Links

- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Pages Documentation:** https://developers.cloudflare.com/pages/
- **Vite Deployment Guide:** https://vitejs.dev/guide/static-deploy.html
- **Community Forum:** https://community.cloudflare.com/

---

## 💰 Cost Breakdown

### Free Tier Includes:

```
✅ Unlimited bandwidth
✅ Unlimited requests
✅ 500 builds per month
✅ 1 concurrent build
✅ Unlimited sites
✅ Unlimited custom domains
✅ DDoS protection
✅ SSL certificates
✅ Web Analytics
✅ Preview deployments

Cost: $0/month
```

### Paid Tier ($20/month):

```
✅ Everything in Free tier
✅ 5,000 builds per month
✅ 5 concurrent builds
✅ Advanced analytics
✅ Priority support

Cost: $20/month (only if you need it)
```

**Recommendation:** Start with free tier - it's more than enough!

---

## 🎯 Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Test all functionality
3. ✅ Configure custom domain
4. ✅ Enable performance optimizations
5. ✅ Set up analytics
6. ✅ Monitor deployment

**Your frontend is now on Cloudflare's global CDN with unlimited bandwidth!** 🚀

