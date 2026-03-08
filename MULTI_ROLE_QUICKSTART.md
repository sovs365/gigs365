# Multi-Role System - Quick Start Guide

## What's New

Your Campus Gigs application now supports three user roles with dedicated dashboards:

1. **Freelancer** - Complete gigs, build skills, earn money
2. **Client** - Post gigs, hire freelancers, manage projects
3. **Admin** - Manage platform, view analytics, moderate content

## Getting Started

### 1. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Sign Up a New Account

Click on the signup link to create your first account.

**URL:** `http://localhost:3000/signup`

**Account Types Available:**

#### Option A: Freelancer Account
- **Description:** "Offer your skills and services to complete gigs"
- **Access:** Regular dashboard with gig listings
- **After Login:** Redirected to `/dashboard`

#### Option B: Client Account
- **Description:** "Post gigs and projects to hire freelancers"
- **Access:** Client dashboard to post and manage gigs
- **After Login:** Redirected to `/dashboard`

#### Option C: Admin Account
- **Description:** "Manage the platform, moderate content, and oversee all activities"
- **Access:** Full admin panel with user management and analytics
- **After Login:** Redirected to `/admin`

### 3. Login

Go to the login page to sign in:

**URL:** `http://localhost:3000/login`

**What Happens:**
- **Freelancers** → Taken to your dashboard
- **Clients** → Taken to your dashboard
- **Admins** → Taken to the admin panel

## Admin Dashboard Features

### Quick Links

Access the admin dashboard at: `http://localhost:3000/admin`

### Dashboard Tabs

#### 📊 Overview Tab
- View platform statistics at a glance
- Total users, gigs, projects count
- User role distribution
- Gig completion stats

#### 👥 Users Tab
- View all registered users
- Filter by role (All, Freelancer, Client, Admin)
- Promote users to admin
- Delete user accounts
- See user details (name, username, email)

#### 🛡️ Moderation Tab
- Review reported content
- Manage flagged users
- Monitor user behavior
- Content moderation features

#### 📈 Reports Tab
- User growth reports
- Platform activity analytics
- Financial summaries
- Transaction records

## Example Workflows

### Workflow 1: Create a Test Admin Account

1. Go to `/signup`
2. Fill in details:
   - Name: `Admin User`
   - Username: `admin_test`
   - Password: `password123`
   - Role: **Admin**
3. Click Sign Up
4. Go to `/login`
5. Log in with admin credentials
6. You'll be redirected to `/admin` automatically

### Workflow 2: Create a Freelancer Account

1. Go to `/signup`
2. Fill in details:
   - Name: `John Freelancer`
   - Username: `john_freelancer`
   - Password: `password123`
   - Role: **Freelancer**
3. Click Sign Up
4. Go to `/login`
5. Log in with credentials
6. You'll be redirected to regular dashboard

### Workflow 3: Promote a User to Admin

1. Log in as an admin (from Workflow 1)
2. Go to `/admin`
3. Click the "Users" tab
4. Find the user you want to promote
5. Click "Make Admin" button
6. User will have admin access on their next login

## API Endpoints

### User Authentication
- `POST /api/auth/signup` - Create new account with role selection
- `POST /api/auth/[...nextauth]` - Login/logout
- `GET /api/auth/user/[username]` - Get user info

### Admin Management (Admin Only)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users?role=FREELANCER` - List users (filterable by role)
- `PATCH /api/admin/users/[userId]` - Update user (change role, etc.)
- `DELETE /api/admin/users/[userId]` - Delete user

## Database Fields

The `users` table now includes a `role` field:

```sql
role TEXT DEFAULT 'FREELANCER'
```

**Allowed Values:**
- `FREELANCER`
- `CLIENT`
- `ADMIN`

## Environment Variables

Make sure these are set in `.env.local`:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Troubleshooting

### Issue: Can't see the role dropdown on signup
**Solution:** Clear browser cache and reload `/signup`

### Issue: Admin dashboard loads but shows no data
**Solution:**
- Ensure you're logged in as an admin user
- Check browser console for errors
- Verify database has user records

### Issue: Getting "Unauthorized" error on admin pages
**Solution:**
- Verify your account has admin role
- Log out and log back in
- Ask another admin to promote your account

### Issue: Role field not in database
**Solution:** Run the database migration:
```bash
npm run db:push
```

## Next Steps

### For Developers
1. Review `MULTI_ROLE_IMPLEMENTATION.md` for technical details
2. Check `middleware.ts` for route protection logic
3. Explore `/app/components/admin/AdminDashboard.tsx` for UI components

### For Testing
1. Create test accounts for each role
2. Test navigation flows for each role
3. Test admin user management features
4. Verify non-admins cannot access `/admin`

### For Production
1. Set strong `NEXTAUTH_SECRET`
2. Configure proper `NEXTAUTH_URL`
3. Use production database
4. Set up backup admin accounts
5. Configure email verification (optional)
6. Enable audit logging (planned feature)

## Support

For issues or questions:
1. Check `MULTI_ROLE_IMPLEMENTATION.md`
2. Review error messages in browser console
3. Check server logs (if running in production)
4. Verify database connection

---

**Enjoy your new multi-role platform!** 🚀
