# 🐝 Campus Task Hive - Complete Vercel Postgres Cloud Database Setup

This guide will help you set up a production-ready Postgres database hosted on Vercel, connected to your Campus Task Hive application.

## 📋 Prerequisites

- A [Vercel](https://vercel.com) account (free)
- Your project deployed/linked to Vercel
- Node.js installed locally

---

## 🚀 Step 1: Create Vercel Postgres Database

### Method A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your `campus-gigs` project (or create one if you haven't)

2. **Access Storage**
   - Click the **Storage** tab at the top
   - Click **Create Database** button

3. **Create Postgres Database**
   - Select **Postgres** as the database type
   - Choose a region closest to you
   - Click **Create Postgres Database**

4. **Copy Connection Strings**
   - You'll see several connection strings
   - Copy `POSTGRES_URL_NON_POOLING` (for development/migrations)
   - Copy `POSTGRES_URL` (for production pooling - optional)

### Method B: Using Vercel CLI

```bash
npm install -g vercel
vercel link
vercel env add POSTGRES_URLNON_POOLING
# Paste your connection string when prompted
```

---

## 🔑 Step 2: Configure Environment Variables

### Local Development (.env.local)

Replace the placeholders with your actual Vercel Postgres connection string:

```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require"

NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Or on Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

### Vercel Deployment Variables

When you link your project to Vercel, the database connection string is **automatically added** as `POSTGRES_URL`. However, you should still add:

1. Go to **Settings** → **Environment Variables** in Vercel Dashboard
2. Add these variables:
   ```
   NEXTAUTH_SECRET = [your secure secret, different from dev]
   NEXTAUTH_URL = https://your-domain.vercel.app
   ```

---

## 🗄️ Step 3: Verify Database Connection Locally

### Test the Connection

```bash
# Make sure you have the correct DATABASE_URL in .env.local
npm install

# Generate Prisma Client
npx prisma generate

# Check if connection works (this will test the connection)
npx prisma db execute --stdin << EOF
SELECT 1;
EOF
```

If you see no errors, your connection is working!

### Reset Database (if needed - WARNING: deletes all data)

```bash
# This will reset the entire database schema
npx prisma db push --force-reset
```

---

## 📊 Step 4: Initialize Database Schema

Run this command to create all tables in your Vercel Postgres database:

```bash
# This pushes your Prisma schema to the cloud database
npx prisma db push
```

You'll see output like:
```
✔ Your database is now in sync with your schema. Done in XXms
```

**Tables Created:**
- ✅ users (registration/login data)
- ✅ gigs (posted tasks)
- ✅ gigApplications (applications for tasks)
- ✅ messages (user messaging/chat)
- ✅ projects (collaborative projects)
- ✅ notifications (system notifications)
- ✅ And more...

---

## 🧪 Step 5: Test Locally with Cloud Database

Now that everything is set up, test the application:

```bash
npm run dev
```

Visit http://localhost:3000 and test:

1. **Registration**
   - Go to /signup
   - Register a new user
   - Check your Vercel Postgres database to see the user created
   ```bash
   npx prisma studio  # Opens database GUI
   ```

2. **Login**
   - Login with the registered credentials
   - Should work instantly (reading from cloud database)

3. **Post a Gig**
   - Click "Post a Task"
   - Fill in details and click "Post"
   - Check that it appears in `/gigs` listing

4. **Apply for Gig**
   - Create another account
   - Apply for the gig
   - Application should be persisted in database

5. **Send Messages**
   - Go to Messages section
   - Send a message to another user
   - Refresh page - message should still be there

✅ If all these work, your cloud database is properly configured!

---

## 🌐 Step 6: Deploy to Vercel

### Automatic Deployment

```bash
# Push your code to GitHub
git add .
git commit -m "Add Vercel Postgres database"
git push origin main
```

Vercel will automatically:
1. Detect your changes
2. Install dependencies
3. Build the project
4. Deploy to your domain

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] `DATABASE_URL` is set in `.env.local` (local development)
- [ ] `DATABASE_URL` or `POSTGRES_URL` is set in Vercel Environment Variables
- [ ] `NEXTAUTH_SECRET` is set in Vercel Environment Variables
- [ ] `NEXTAUTH_URL` is set to your Vercel domain (e.g., `https://campus-gigs.vercel.app`)
- [ ] `npx prisma db push` completed successfully
- [ ] User registration works and saves to database
- [ ] Login retrieves user from database
- [ ] Gig posting saves to database
- [ ] Messages persist in database
- [ ] All API routes return data instead of empty arrays

---

## 🔧 Troubleshooting

### ❌ "Can't reach database server"
**Solution:**
- Verify your DATABASE_URL is correct
- Check Vercel Postgres dashboard to ensure database is running
- Try connecting with `npx prisma deploy`

### ❌ "NEXTAUTH_SECRET is not set"
**Solution:**
- Generate a secret: `openssl rand -base64 32`
- Add to `.env.local` for development
- Add to Vercel Environment Variables for production

### ❌ "Prisma Client not found"
**Solution:**
```bash
rm -rf node_modules .next
npm install
npx prisma generate
```

### ❌ "Connection string has invalid format"
**Solution:**
- Copy directly from Vercel Storage tab
- Ensure it starts with `postgresql://`
- Includes `?sslmode=require` at the end

### ❌ "Timeout during migration"
**Solution:**
- Vercel Postgres might be in startup phase
- Wait a few minutes and retry
- Check Vercel Status page

---

## 📖 Useful Commands

```bash
# View database GUI with all data
npx prisma studio

# Check database schema
npx prisma introspect

# Generate Prisma Client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# View migration status
npx prisma migrate status

# Reset entire database (CAREFUL!)
npx prisma db push --force-reset
```

---

## 🎯 What's Included

Your Vercel Postgres database now handles:

| Feature | Database Table | Status |
|---------|---|---|
| User Registration | `users` | ✅ Cloud |
| Login/Authentication | `users` | ✅ Cloud |
| Post Gigs/Tasks | `gigs` | ✅ Cloud |
| Apply for Gigs | `gigApplications` | ✅ Cloud |
| User Messaging/Chat | `messages` | ✅ Cloud |
| Accept/Reject Applications | `gigApplications` | ✅ Cloud |
| User Profiles | `users` | ✅ Cloud |
| Notifications | `notifications` | ✅ Cloud |
| Projects (Optional) | `projects` | ✅ Cloud |

---

## 📞 Support

If you encounter issues:

1. Check [Vercel Docs](https://vercel.com/docs/storage/postgres)
2. Review [Prisma Docs](https://www.prisma.io/docs/)
3. Check application logs: `vercel logs`
4. View database: `npx prisma studio`

---

**Your Campus Task Hive app is now running on enterprise-grade cloud infrastructure! 🎉**
