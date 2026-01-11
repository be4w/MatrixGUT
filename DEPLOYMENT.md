# MatrixGUT - Vercel + Neon Deployment Guide

## 🎯 Overview

This app uses:
- **Frontend + Backend**: Vercel (100% free Hobby plan)
- **Database**: Neon Postgres (free tier)
- **Deployment**: Automatic via GitHub

## ✅ Prerequisites

- [x] GitHub account with MatrixGUT repo
- [x] Vercel account (free)
- [x] Neon database created

## 🚀 Setup Steps

### 1. Vercel Project Configuration

1. **Connect GitHub Repo**
   - Go to https://vercel.com/new
   - Import your GitHub repo: `be4w/MatrixGUT`
   - Click "Deploy"

2. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add variable:
     - **Name**: `DATABASE_URL`
     - **Value**: Your Neon connection string
       ```
       postgresql://neondb_owner:[password]@[host]/[database]?sslmode=require
       ```
   - Select all environments: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

3. **Trigger Redeploy**
   - Go to Deployments tab
   - Click "⋯" menu on latest deployment
   - Click "Redeploy"
   - ✅ Check "Use existing Build Cache"
   - Click "Redeploy"

### 2. Get Your Neon Connection String

1. Go to https://console.neon.tech/
2. Select your project
3. Click "Connection String"
4. Copy the full string (it includes password)

### 3. Verify Database Schema

Your Neon database should have a `tasks` table:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  gravity INTEGER NOT NULL,
  urgency INTEGER NOT NULL,
  tendency INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  sensitive BOOLEAN NOT NULL DEFAULT false,
  labels TEXT[],
  notes TEXT
);
```

## 🧪 Testing Checklist

After deployment, test these operations:

### ✅ View Tasks
- [ ] Visit your Vercel URL
- [ ] Existing tasks load correctly
- [ ] No console errors

### ✅ Create Task
- [ ] Click "Add Task"
- [ ] Enter: Name = "Test Task", G=5, U=4, T=3
- [ ] Task appears in list
- [ ] Refresh page → task still there

### ✅ Update Task
- [ ] Expand a task
- [ ] Change Gravity/Urgency/Tendency
- [ ] Refresh page → changes persisted

### ✅ Delete Task
- [ ] Click trash icon on a task
- [ ] Task disappears
- [ ] **🎯 CRITICAL TEST**: Refresh page → task stays deleted

### ✅ Mark Complete
- [ ] Check checkbox on a task
- [ ] Refresh page → task still marked complete

## 🔍 Troubleshooting

### Issue: 404 on DELETE /api/tasks/[id]

**Cause**: `vercel.json` not configured properly

**Fix**: Ensure `vercel.json` contains:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue: Tasks disappear on refresh

**Cause**: DATABASE_URL not set or incorrect

**Fix**:
1. Go to Vercel Project Settings → Environment Variables
2. Verify `DATABASE_URL` is set for **all environments**
3. Click "Redeploy" after adding/changing variables

### Issue: "Database connection failed"

**Cause**: Wrong connection string or Neon database inactive

**Fix**:
1. Test connection string in Neon dashboard
2. Ensure database is active (not suspended)
3. Check connection string includes `?sslmode=require`

### Issue: Build fails on Vercel

**Cause**: Missing dependencies or build errors

**Fix**:
1. Check Vercel deployment logs
2. Verify `package.json` has all dependencies
3. Try building locally: `npm run build`

## 📊 Vercel Deployment Logs

To check if API routes are working:

1. Go to Vercel Dashboard → Your Project
2. Click on latest deployment
3. Click "Functions" tab
4. You should see: `api/[...slug].func`
5. Click on it to see invocation logs

## 🎬 Next Steps After Successful Deployment

1. **Remove Railway Project** (if still exists)
   - Railway is no longer needed
   - Delete the project to avoid confusion

2. **Update GitHub README** (optional)
   - Document the Vercel + Neon setup
   - Remove Railway references

3. **Star the repo** ⭐
   - You built something awesome!

## 💰 Cost Breakdown

- Vercel Hobby: **$0/month** (free forever)
- Neon Free Tier: **$0/month** (512 MB storage, 1 project)
- **Total: FREE** ✅

## 🆘 Need Help?

If you're still seeing issues:

1. Check Vercel deployment logs (Functions tab)
2. Check browser console for errors (F12 → Console)
3. Verify DATABASE_URL in Vercel settings
4. Try a fresh deployment (Deployments → Redeploy)
