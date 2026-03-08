# Campus Task Hive - Database Setup Guide

## Step 1: Create Vercel Postgres Database

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`campus-gigs`)
3. Go to **Storage** tab → Click **Create Database**
4. Choose **Postgres** from the options
5. Click **Create Database**
6. Copy the **Postgres Connection String** (labeled as `POSTGRES_URL_NON_POOLING` for development)

### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel link
vercel env add DATABASE_URL
# Paste your Vercel Postgres connection string
```

## Step 2: Update Your Environment Variables

Replace `DATABASE_URL` in `.env.local` with your Vercel Postgres connection string:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 3: Run Database Migrations

```bash
# Install Prisma if not already installed
npm install @prisma/client prisma --save

# Push the schema to your Vercel Postgres database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 4: Verify Connection

The app will automatically connect to your Vercel Postgres database. You'll know it's working when:

✅ User registration saves to database  
✅ Login works with stored credentials  
✅ Posted gigs appear in the database  
✅ Gig applications are saved and tracked  
✅ Messages persist between users  
✅ User profiles are stored correctly  

## Step 5: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000

3. Test the full flow:
   - Register a new user (data should be saved in database)
   - Login with the registered credentials
   - Post a gig (should appear in database)
   - Apply for a gig as another user (application saved)
   - Send messages to other users (should persist)

## Troubleshooting

### Connection Refused
- Check your DATABASE_URL is correct
- Ensure Vercel Postgres database is running
- Verify IP whitelist settings in Vercel dashboard

### Prisma Type Errors
```bash
npx prisma generate
npx prisma db push --force-reset  # WARNING: This deletes all data!
```

### Migrations Already Exist
If you have local migrations from sqlite/localhost, remove them:
```bash
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

## Production Deployment

When deploying to Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add your production `DATABASE_URL` from Vercel Postgres
3. Ensure `NEXTAUTH_SECRET` is set (different value than development)
4. Ensure `NEXTAUTH_URL` is set to your production domain
5. Deploy - Vercel will automatically run `prisma generate`

## Database Models

Your Vercel Postgres database includes tables for:
- **Users** - Registration, profiles, credentials
- **Gigs** - Task postings with category/budget
- **GigApplications** - Applications with acceptance status
- **Messages** - User-to-user messaging/chat
- **Projects** - Collaborative projects (optional)
- **Notifications** - System notifications

All data will persist in Vercel Postgres!
