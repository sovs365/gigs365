# 🚀 Quick Start - Vercel Postgres Cloud Database

## 5-Minute Setup

### Step 1: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Select your `campus-gigs` project (or create one)
3. Click **Storage** tab → **Create Database** → **Postgres**
4. Choose a region and click **Create**

### Step 2: Get Connection String

1. In Storage, click your Postgres database
2. Click **Connect** button
3. Copy the `POSTGRES_URL_NON_POOLING` string

### Step 3: Update .env.local

Replace the placeholder in `.env.local`:

```env
DATABASE_URL="postgresql://default:YOUR_PASSWORD@aws-0-us-east-1.pooling.vercel-storage.com:6543/vercel?sslmode=require"
NEXTAUTH_SECRET="generate-secure-string"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Initialize Database

```bash
npm install
npx prisma db push
npm run db:test
```

### Step 5: Start Development

```bash
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Register a user (saved to cloud database)
- ✅ Login (reads from cloud database)
- ✅ Post a gig (stored in cloud)
- ✅ Apply for gig (application persisted)
- ✅ Send messages (stored in cloud)

---

## 🌐 Deploy to Vercel

```bash
git add .
git commit -m "Add Vercel Postgres database"
git push origin main
```

Vercel detects your code changes and automatically:
- Installs dependencies
- Runs `npm run build` (which runs `prisma generate`)
- Deploys to your domain
- Database automatically connected!

---

## 📝 Useful Commands

```bash
# View your cloud database data in a GUI
npm run db:studio

# Verify database connection
npm run db:test

# Push schema changes to cloud database
npm run db:push

# Generate Prisma JavaScript client
npm run db:generate

# ⚠️ Reset entire database (deletes all data!)
npm run db:reset
```

---

## ✅ Production Checklist

Before going live:

- [ ] DATABASE_URL set in Vercel Environment Variables
- [ ] NEXTAUTH_SECRET set in Vercel Environment Variables (different value!)
- [ ] NEXTAUTH_URL set to your Vercel domain (e.g., https://campus-gigs.vercel.app)
- [ ] Ran `npx prisma db push` once for schema initialization
- [ ] Tested registration → data appears in database
- [ ] Tested gig posting → appears in database
- [ ] Tested messaging → messages persist

---

**That's it! Your app is now running on enterprise-grade cloud infrastructure! 🎉**

For detailed troubleshooting, see `VERCEL_POSTGRES_SETUP.md`
