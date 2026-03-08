# Multi-Role System Implementation Guide

## Overview

The Campus Gigs platform now supports three distinct user roles:

1. **Freelancer** - Users who complete gigs and projects
2. **Client** - Users who post gigs and projects to hire freelancers
3. **Admin** - Platform administrators with full access to manage users, content, and view analytics

All users register and login from the same endpoints, and are redirected to appropriate dashboards based on their role.

## Features Implemented

### 1. Multi-Role Signup System

**Location:** `/signup`

The signup form now includes an "Account Type" dropdown where users can select their role:
- **Freelancer (Default)** - Offer your skills and services to complete gigs
- **Client** - Post gigs and projects to hire freelancers
- **Admin** - Manage the platform, moderate content, and oversee all activities

### 2. Unified Login System

**Location:** `/login`

Users log in with their username and password. The system automatically redirects them based on their role:
- **Freelancers & Clients** → `/dashboard`
- **Admins** → `/admin`

### 3. Admin Dashboard

**Location:** `/admin` (Admin-only)

The admin dashboard includes four main sections:

#### Overview Tab
- **Platform Statistics:**
  - Total unique users
  - Freelancer count
  - Client count
  - Total gigs posted
  - Active gigs
  - Completed gigs
  - Total projects
  - Admin count

#### Users Tab
- **User Management:**
  - View all users or filter by role
  - Promote users to admin
  - Delete users
  - View user details (name, username, email, role)
  - Role-based color coding for quick identification

#### Moderation Tab
- Access features to manage platform content:
  - Review reported content
  - Manage flagged users
  - Monitor user-generated content

#### Reports Tab
- Access detailed analytics:
  - User growth trends
  - Platform activity metrics
  - Financial summary
  - Transaction data

## Database Schema Changes

### User Model Updates

Added a new `role` field to the User model:

```prisma
model User {
  id   String   @id @default(cuid())
  // ... existing fields ...
  role String   @default("FREELANCER")  // FREELANCER, CLIENT, ADMIN
  // ... rest of fields ...
}
```

**Role values:** `FREELANCER`, `CLIENT`, `ADMIN`

## API Endpoints

### Authentication

**POST /api/auth/signup**
- Create a new user account
- Parameters:
  - `name`: Full name (required)
  - `username`: Username (required, 3+ chars, alphanumeric with - and _)
  - `phone`: Phone number (optional)
  - `password`: Password (required, 8+ chars)
  - `role`: Account type (FREELANCER | CLIENT | ADMIN, default: FREELANCER)

**POST /api/auth/[...nextauth]**
- NextAuth authentication endpoints

**GET /api/auth/user/[username]**
- Get user information by username
- Returns user details including role

### Admin APIs

**GET /api/admin/stats** (Admin-only)
- Retrieve platform statistics
- Returns counts for users, gigs, projects, and role breakdowns

**GET /api/admin/users** (Admin-only)
- Get list of users
- Query parameter: `role` (ALL | FREELANCER | CLIENT | ADMIN)
- Supports filtering by user role

**PATCH /api/admin/users/[id]** (Admin-only)
- Update user information
- Parameters:
  - `role`: Change user role (optional)
  - `name`: Update name (optional)
  - `bio`: Update bio (optional)

**DELETE /api/admin/users/[id]** (Admin-only)
- Delete a user account
- Prevents deletion of the last admin user

## Security Features

### Role-Based Access Control

- **Middleware Protection:** `middleware.ts` protects admin routes
  - Only users with `role: "ADMIN"` can access `/admin`
  - Non-admin users are redirected to `/dashboard`
  - Unauthenticated users are redirected to `/login`

- **API Protection:** All admin endpoints verify user role server-side
  - Returns 403 Forbidden if user is not an admin
  - Checks performed using NextAuth session

### Authentication Flow

1. **User logs in** → NextAuth validates credentials
2. **Session created** → Role included in JWT token
3. **Redirect applied** → User routed to appropriate dashboard
4. **Route protected** → Middleware enforces role-based access

## Modified/Created Files

### Modified Files

1. **prisma/schema.prisma**
   - Added `role` field to User model

2. **app/signup/page.tsx**
   - Added role selection dropdown
   - Added role description text
   - Updated form submission to include role

3. **app/api/auth/signup/route.ts**
   - Updated validation schema to accept `role` parameter
   - Updated user creation to set role

4. **app/lib/auth.ts**
   - Updated JWT callback to include role
   - Updated session callback to include role in session

5. **app/lib/next-auth.d.ts**
   - Extended User and Session types with role field
   - Updated JWT type definition

6. **app/components/LoginForm.tsx**
   - Added session-based redirect logic
   - Redirects to `/admin` for admins, `/dashboard` for others

### Created Files

1. **app/admin/page.tsx**
   - Admin dashboard page with role/auth protection

2. **app/components/admin/AdminDashboard.tsx**
   - Complete admin dashboard component with all features:
     - Overview tab with statistics
     - Users tab with management features
     - Moderation tab (base template)
     - Reports tab (base template)

3. **middleware.ts**
   - Route protection middleware for admin routes
   - Enforces role-based access control

4. **app/api/admin/stats/route.ts**
   - API endpoint for platform statistics

5. **app/api/admin/users/route.ts**
   - API endpoint for user listing and filtering

6. **app/api/admin/users/[id]/route.ts**
   - API endpoints for updating and deleting users

7. **app/api/auth/user/[username]/route.ts**
   - API endpoint for getting user info by username

## Usage Instructions

### For Freelancers

1. Go to `/signup`
2. Select "Freelancer" as account type
3. Fill in required information
4. Click "Sign Up"
5. Log in with credentials
6. Access freelancer dashboard at `/dashboard`

### For Clients

1. Go to `/signup`
2. Select "Client" as account type
3. Fill in required information
4. Click "Sign Up"
5. Log in with credentials
6. Access client dashboard at `/dashboard`

### For Admins

1. Go to `/signup`
2. Select "Admin" as account type
3. Fill in required information
4. Click "Sign Up"
5. Log in with credentials
6. Access admin dashboard at `/admin`
7. Manage users, view statistics, and moderate content

### Promoting Users to Admin

1. Log in as an existing admin
2. Go to `/admin`
3. Navigate to "Users" tab
4. Filter by desired role or view all
5. Click "Make Admin" button next to a user
6. User will have admin access on next login

## Database Migration

The following migration was applied:
- Added `role` field (String) to User model with default value "FREELANCER"
- No destructive changes; all existing users default to FREELANCER role

To apply this migration:

```bash
# Set DATABASE_URL environment variable
$env:DATABASE_URL="file:./prisma/dev.db"

# Push schema changes
npx prisma db push
```

## Future Enhancements

Consider implementing:

1. **Advanced Moderation Tools**
   - Content filtering
   - Automated abuse detection
   - Detailed activity logs

2. **Analytics Dashboard**
   - Revenue tracking
   - User growth charts
   - Gig completion rates
   - Quality metrics

3. **User Management**
   - Ban/suspend users
   - Email verification
   - Two-factor authentication

4. **Role-Specific Features**
   - Freelancer certifications
   - Client verification
   - Admin audit trails

5. **Payment Integration**
   - Transaction logs
   - Refund management
   - Revenue distribution

## Testing

### Test Signup Flow
- [ ] Sign up as freelancer
- [ ] Sign up as client
- [ ] Sign up as admin
- [ ] Verify role selection dropdown works
- [ ] Verify form validation

### Test Login Flow
- [ ] Login redirects freelancer to `/dashboard`
- [ ] Login redirects client to `/dashboard`
- [ ] Login redirects admin to `/admin`

### Test Admin Dashboard
- [ ] View platform statistics
- [ ] Filter users by role
- [ ] Promote user to admin
- [ ] Delete user
- [ ] Verify non-admin cannot access `/admin`

### Test API Endpoints
- [ ] GET /api/admin/stats returns correct data
- [ ] GET /api/admin/users filters correctly
- [ ] PATCH /api/admin/users/[id] updates role
- [ ] DELETE /api/admin/users/[id] removes user
- [ ] All endpoints return 403 for non-admin users

## Troubleshooting

### "Database connection failed" error
- Ensure DATABASE_URL is set in .env.local
- For SQLite: `DATABASE_URL="file:./prisma/dev.db"`

### Admin dashboard not loading
- Verify user has `role: "ADMIN"` in database
- Check browser console for TypeScript errors
- Ensure authentication session is valid

### Role not appearing after signup
- Verify Prisma migration was applied: `npx prisma db push`
- Check user record in database includes role field

### Can't access admin routes
- Verify middleware.ts exists and is properly configured
- Check that NextAuth session includes role
- Ensure NEXTAUTH_SECRET environment variable is set
