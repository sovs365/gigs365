# 🐝 Campus Task Hive - Cloud-Ready Application

A modern task marketplace platform connecting students and campus community members. Built with Next.js, Prisma ORM, and Vercel Postgres for enterprise-grade reliability.

## ✨ Features

### 🔐 Authentication & Registration
- Phone number-based registration (+254 Kenya format)
- Secure password hashing with bcryptjs
- NextAuth session management
- Data persisted in **Vercel Postgres** cloud database

### 📋 Task Management
- **Post Tasks/Gigs** - Define title, description, category, budget, duration
- **7 Task Categories** - Academic, Tech, Creative, Digital, Physical, Campus, Other
- **Browse Tasks** - Light theme with search and filtered categories
- **Apply for Tasks** - Submit applications with optional cover letter
- **Application Tracking** - Accept/reject applications, automatic gig closure

### 💬 Messaging System
- **Direct User Messages** - Send and receive messages from other users
- **Real-time Chat** - Conversations persist in **Vercel Postgres**
- **Message History** - View past conversations
- **Read Status** - Track read/unread messages

### 🎨 User Interface
- **Light Theme** - White backgrounds, amber/orange accents, 🐝 branding
- **Responsive Design** - Works on desktop, tablet, mobile
- **Modern Components** - Tailwind CSS with custom styling
- **Smooth Interactions** - Loading states, error handling, success messages

### 🌐 Cloud Infrastructure
- **Vercel Postgres Database** - Enterprise-grade PostgreSQL hosting
- **Automatic Backups** - Data protection included
- **Scalable Storage** - Grows with your user base
- **Fast Performance** - Optimized database queries
- **Secure Connections** - SSL encrypted (sslmode=require)

---

## 🚀 Quick Start (2 Steps)

### Step 1: Create Cloud Database
1. Go to https://vercel.com/dashboard
2. Select your project → **Storage** → **Create Database** → **Postgres**
3. Copy the `POSTGRES_URL_NON_POOLING` connection string

### Step 2: Configure & Run
```bash
# Update DATABASE_URL in .env.local with your Vercel connection string
nano .env.local

# Install and setup
npm install
npx prisma db push
npm run db:test

# Start development
npm run dev
```

Visit http://localhost:3000 ✅

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup guide |
| [VERCEL_POSTGRES_SETUP.md](./VERCEL_POSTGRES_SETUP.md) | Detailed cloud database setup |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database models and schema |
| [vercel.json](./vercel.json) | Deployment configuration |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16, Tailwind CSS 4 |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | Vercel Postgres (PostgreSQL 14+) |
| **ORM** | Prisma 5.8 |
| **Auth** | NextAuth.js 4.24, bcryptjs |
| **Validation** | Zod 3.22 |
| **Hosting** | Vercel (auto-scaled) |

---

## 🗄️ Database Tables

All data persisted in **Vercel Postgres**:

```
users ────────────────┐
                      ├── gigs
gigApplications ─────┤
                      ├── messages
messages ────────────┤
                      └── notifications

Additional tables:
- projects (collaborative projects)
- projectMembers (project collaboration)
- projectDiscussions (project discussions)
- notifications (system notifications)
```

---

## 🔐 Environment Variables

Create `.env.local` with:

```env
# From Vercel Storage → Postgres → Connect
DATABASE_URL="postgresql://..."

# Generate: openssl rand -base64 32
NEXTAUTH_SECRET="..."

# Development
NEXTAUTH_URL="http://localhost:3000"

# Production (after deployment)
# NEXTAUTH_URL="https://your-domain.vercel.app"
```

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:push         # Push schema changes to Vercel Postgres
npm run db:studio       # Open database GUI (localhost:5555)
npm run db:test         # Test database connection
npm run db:generate     # Generate Prisma Client
npm run db:reset        # ⚠️ Reset entire database (deletes all data!)

# Code Quality
npm run lint            # Run ESLint
```

---

## 🎯 Test the Application

### 1. Register User
```
Go to /signup
Enter: name, phone (+254XXXXXXXXX), password
✅ Data saved to Vercel Postgres
```

### 2. Login
```
Go to /login
Use registered credentials
✅ Session created, stored in Vercel Postgres
```

### 3. Post a Task
```
Go to /post-gig
Fill in title, description, category, budget, duration
✅ Gig posted to Vercel Postgres
```

### 4. Browse Tasks
```
Go to /gigs
See all posted tasks with light theme
Filter by category or search by title
✅ Data loaded from Vercel Postgres
```

### 5. Apply for Task
```
Click on a gig → Click "Apply"
Enter optional cover letter
✅ Application saved to Vercel Postgres
```

### 6. Send Messages
```
Navigate to /messages
Send a message to another user
✅ Message persisted in Vercel Postgres
```

---

## 🌐 Deployment to Vercel

### Automatic Deployment
```bash
git push origin main
# Vercel automatically:
# - Installs dependencies
# - Runs "npm run build" (which generates Prisma Client)
# - Deploys to your domain
# - Connects to Vercel Postgres automatically!
```

### Manual Deployment
```bash
vercel --prod
```

### Important Deployment Settings
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=postgresql://... (from Vercel Storage)
   NEXTAUTH_SECRET=your-production-secret (different from dev!)
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
3. Deploy!

---

## 🔄 Database Workflow

```
User Registration
    ↓
Form Validation (Zod)
    ↓
Hash Password (bcryptjs)
    ↓
Create User Record
    ↓
📍 SAVED IN VERCEL POSTGRES
    ↓
Return Success Response
```

```
User Applies for Gig
    ↓
Check Session (NextAuth)
    ↓
Validate Application Data
    ↓
Create GigApplication Record
    ↓
📍 SAVED IN VERCEL POSTGRES
    ↓
Send Confirmation Message
    ↓
Check Gig Owner Dashboard
    ↓
Accept Application
    ↓
📍 UPDATE GIG STATUS = "closed"
    ↓
💬 Gig Disappears from Application List
```

---

## 🆘 Troubleshooting

### Connection Error
```
Error: Can't reach database server at `localhost:5432`
```
**Solution:** Use Vercel Postgres connection string, not localhost!

### NEXTAUTH Errors
```
Error: NEXTAUTH_SECRET is not set
```
**Solution:** Generate secret with `openssl rand -base64 32` and add to .env.local

### Prisma Errors
```bash
npm install
npx prisma generate
npx prisma db push
```

### View Database
```bash
npm run db:studio
# Opens http://localhost:5555 with database GUI
```

---

## 📞 Support Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/postgres)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

## 📄 License

This project is open source and available under the MIT License.

---

**🎉 Your Campus Task Hive application is production-ready with enterprise-grade cloud infrastructure!**

Start with [QUICKSTART.md](./QUICKSTART.md) for immediate setup.
