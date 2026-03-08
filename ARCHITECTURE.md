# 🏗️ Campus Task Hive - Cloud Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAMPUS TASK HIVE APP                        │
│                   (Next.js localhost:3000)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (HTTPS/SSL Encrypted)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                           │
│                                                                 │
│  /api/auth/signup      → Register users                         │
│  /api/auth/login       → Validate credentials                   │
│  /api/gigs             → Post/list gigs                         │
│  /api/gigs/[id]/apply  → Submit applications                    │
│  /api/messages         → Send/receive messages                  │
│  /api/messages/[id]    → Chat conversations                     │
│                                                                 │
│  🔐 NextAuth Session Management                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (Prisma ORM - Typed)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  VERCEL POSTGRES DATABASE                       │
│           (Cloud-hosted, auto-backed up, auto-scaled)          │
│                                                                 │
│  📊 Tables:                                                      │
│  ├─ users             (registration, auth, profiles)            │
│  ├─ gigs              (posted tasks/gigs)                       │
│  ├─ gigApplications   (applications with status)                │
│  ├─ messages          (user-to-user chat)                       │
│  ├─ projects          (collaborative projects)                  │
│  ├─ notifications     (system alerts)                           │
│  └─ ... (6 more tables)                                         │
│                                                                 │
│  🔒 Security: SSL/TLS encrypted connections                    │
│  💾 Backups: Automatic daily backups                           │
│  📈 Scaling: Auto-scales with traffic                          │
│  🌍 Location: AWS data center (your region)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Registration Flow

```
USER REGISTRATION
════════════════════════════════════════════════════════════════

1. User fills form
   ↓ name, phone (+254XXXXXXXXX), password
   ↓ confirm password

2. Form validation (Client-side)
   ↓ Validate phone format
   ↓ Check passwords match
   ↓ Minimum password length

3. Submit to /api/auth/signup (API Route)
   ↓ POST request with credentials

4. Server-side validation (Zod schema)
   ↓ Verify phone format regex: /^\+254\d{9}$/
   ↓ Verify password ≥ 8 characters

5. Check for existing user
   ↓ Query: SELECT * FROM users WHERE phone = ?
   ↓ If exists → Error: "Already registered"

6. Hash password (bcryptjs)
   ↓ bcrypt.hash(password, 10)
   ↓ Cost factor = 10 (secure)

7. Create user in database
   ↓ INSERT INTO users (phone, password_hash, name, email)
   ↓ 📍 SAVED TO VERCEL POSTGRES ✅

8. Return success response
   ↓ User redirected to /login
   ↓ Data now persisted in cloud

USER CAN NOW LOGIN ✅
```

---

## Login Flow

```
USER LOGIN
════════════════════════════════════════════════════════════════

1. User enters phone & password
   ↓ Form on /login page

2. Submit to NextAuth callback
   ↓ POST /api/auth/signin

3. Validate credentials
   ↓ Query DB: SELECT * FROM users WHERE phone = ?
   ↓ 📍 READ FROM VERCEL POSTGRES ✅

4. Compare passwords
   ↓ bcrypt.compare(input, stored_hash)
   ↓ Returns true/false

5. If valid → Create session
   ↓ NextAuth stores session
   ↓ JWT token created
   ↓ Cookie set on client

6. Redirect to dashboard
   ↓ User now authenticated
   ↓ Can post gigs, apply, message

SESSION PERSISTED ✅
```

---

## Gig Posting Flow

```
POST A GIG
════════════════════════════════════════════════════════════════

1. User navigates to /post-gig
   ↓ Form with fields:
   ├─ Title
   ├─ Description
   ├─ Category (dropdown)
   ├─ Budget
   ├─ Duration
   └─ Difficulty

2. Fill form & submit
   ↓ POST to /api/gigs

3. Validate data (Zod schema)
   ↓ Check required fields
   ↓ Verify budget is positive
   ↓ Check title length

4. Verify user session
   ↓ NextAuth session check
   ↓ Get user ID from session

5. Create gig record
   ↓ INSERT INTO gigs
   ├─ title, description
   ├─ category, budget
   ├─ duration, posterId
   └─ status: "open"
   ↓ 📍 SAVED TO VERCEL POSTGRES ✅

6. Return success
   ↓ Redirect to /gigs
   ↓ New gig appears in listing

GIG POSTED & PERSISTED ✅
```

---

## Gig Application Flow

```
APPLY FOR GIG
════════════════════════════════════════════════════════════════

1. User views gig detail (/gig/[id])
   ↓ See gig posted by someone else
   ↓ Click "Apply for this Task"

2. See application form
   ├─ Cover letter (optional textarea)
   └─ Submit button

3. Submit application
   ↓ POST to /api/gigs/[id]/apply
   ├─ Body: { coverLetter: "..." }

4. Server validation
   ↓ Check user logged in
   ↓ Verify gig exists
   ↓ Check user not already applied

5. Create application record
   ↓ INSERT INTO gigApplications
   ├─ gigId, applicantId
   ├─ coverLetter
   ├─ status: "pending"
   └─ appliedAt: now()
   ↓ 📍 SAVED TO VERCEL POSTGRES ✅

6. Return success
   ↓ Show confirmation: "✅ Application submitted!"
   ↓ Button changes to "⏳ Application Pending"

AWAITING DECISION ✅

7. Gig owner reviews applications
   ↓ Dashboard shows all applications
   ↓ Can see applicant cover letters
   ↓ Click "Accept" or "Reject"

8. Owner accepts application
   ↓ PATCH /api/gigs/[id]/applications/[appId]
   ├─ status: "accepted"
   └─ respondedAt: now()
   ↓ UPDATE gig SET status = "closed"
   ↓ 📍 UPDATED IN VERCEL POSTGRES ✅

9. Automatic effects
   ├─ Gig disappears from available list
   ├─ Other applicants get "❌ Gig Closed"
   ├─ Accepted applicant sees "✅ Accepted!"
   └─ Owner & applicant can message

TRANSACTION COMPLETE ✅
```

---

## Messaging Flow

```
SEND MESSAGE
════════════════════════════════════════════════════════════════

1. User navigates to /messages
   ↓ See list of conversations
   ↓ Click on user to chat

2. View message thread
   ↓ GET /api/messages/[userId]
   ↓ 📍 READ FROM VERCEL POSTGRES ✅
   ├─ Fetch all messages with this user
   ├─ Order by timestamp (newest last)
   └─ Show on screen

3. User types message
   ↓ Text input field
   ↓ Click "Send"

4. Submit message
   ↓ POST /api/messages
   ├─ Body: {
   │  recipientId: "user-id",
   │  content: "message text"
   │ }

5. Validate message
   ↓ Check user logged in
   ↓ Verify recipient exists
   ↓ Check message not empty
   ↓ Verify message ≤ 2000 chars

6. Create message record
   ↓ INSERT INTO messages
   ├─ senderId, recipientId
   ├─ content
   ├─ read: false
   └─ createdAt: now()
   ↓ 📍 SAVED TO VERCEL POSTGRES ✅

7. Return confirmation
   ↓ Display message on screen
   ↓ Show timestamp

MESSAGE PERSISTED ✅

8. Recipient receives
   ↓ When recipient opens chat
   ↓ GET /api/messages/[senderId]
   ↓ 📍 READ FROM VERCEL POSTGRES ✅
   ├─ Fetch all messages with sender
   ├─ See new message
   └─ Mark as read

CONVERSATION STORED PERMANENTLY ✅
```

---

## Database Schema Overview

```
USERS
├─ id (string)
├─ phone (unique, +254XXXXXXXXX)
├─ email (unique, auto-generated)
├─ name (string)
   username (string)
├─ password (hashed)
├─ bio (optional)
├─ avatar (optional)
├─ university, major, yearsOfStudy
├─ socialLinks (github, linkedin, etc)
└─ timestamps (createdAt, updatedAt)

    ↓
    ├─→ GIGS (posts)
    │   ├─ id
    │   ├─ title, description
    │   ├─ category, budget
    │   ├─ duration, status
    │   ├─ posterId (FK → users)
    │   └─ timestamps
    │
    ├─→ GIG_APPLICATIONS
    │   ├─ id
    │   ├─ gigId (FK → gigs)
    │   ├─ applicantId (FK → users)
    │   ├─ status (pending/accepted/rejected)
    │   ├─ coverLetter
    │   └─ timestamps
    │
    ├─→ MESSAGES
    │   ├─ id
    │   ├─ senderId (FK → users)
    │   ├─ recipientId (FK → users)
    │   ├─ content
    │   ├─ read (boolean)
    │   └─ createdAt
    │
    └─→ NOTIFICATIONS
        ├─ id
        ├─ userId (FK → users)
        ├─ type, message
        ├─ read (boolean)
        └─ createdAt

All tables auto-create with: npx prisma db push
```

---

## Data Flow on Page Load

```
User visits localhost:3000/gigs
    ↓
1. Browser loads HTML/CSS/JS
    ↓
2. React component mounts
    ↓
3. useEffect hook runs
    ↓
4. Fetch from /api/gigs
    ↓ HTTP GET request
    ↓
API Route Handler
    ├─ Check session (optional)
    ├─ Get query params (category, search)
    ├─ Query database:
    │  SELECT * FROM gigs
    │  WHERE status = "open"
    │  AND (category = ? if filtered)
    │  📍 READS FROM VERCEL POSTGRES ✅
    └─ Return JSON response
    ↓
5. Component receives data
    ↓
6. useState updates
    ↓
7. Component re-renders
    ↓
8. UI shows all gigs from cloud database ✅
    ↓
User sees live data on page
```

---

## Deployment Architecture

```
DEVELOPMENT
└─ localhost:3000
   ├─ Next.js dev server
   └─ Connected to Vercel Postgres (cloud)

PRODUCTION
└─ yourdomain.vercel.app (Vercel hosting)
   ├─ Next.js server (auto-scaled)
   └─ Connected to Vercel Postgres (cloud)

Benefits:
✅ Automatic deployments on git push
✅ Auto-scaling with traffic
✅ Built-in caching
✅ CDN for static assets
✅ Database connection pooling
✅ Automatic SSL/TLS certificates
✅ Monitoring & analytics
```

---

## Security Architecture

```
User Input
    ↓
CLIENT-SIDE VALIDATION
├─ Zod schema validation
└─ Prevents obvious errors

    ↓
HTTPS/TLS ENCRYPTION
├─ All data encrypted in transit
└─ Prevents interception

    ↓
SERVER-SIDE VALIDATION
├─ Re-validate all inputs
├─ Check user permissions
└─ Verify database relationships

    ↓
PASSWORD HASHING
├─ bcryptjs (cost: 10)
├─ Never store plain text
└─ Salted and hashed

    ↓
SESSION MANAGEMENT
├─ NextAuth.js handles sessions
├─ JWT tokens
└─ HttpOnly cookies

    ↓
DATABASE (VERCEL POSTGRES)
├─ SSL required (sslmode=require)
├─ Data at rest encrypted
├─ No direct SQL
└─ Prisma ORM prevents injection

    ↓
OUTPUT VALIDATION
├─ JSON responses validated
├─ No sensitive data in responses
└─ Proper error handling

SECURE DATA JOURNEY ✅
```

---

## Error Handling

```
If Database Connection Fails
    ↓
API routes have try-catch blocks
    ↓
Error logged to console
    ↓
Return user-friendly error message
    ↓
Frontend shows: "Failed to load data"
    ↓
User can retry

Graceful degradation:
✅ Not crashing
✅ Helpful error messages
✅ User can retry
✅ Data is safe
```

---

## Scaling As You Grow

```
1-100 Users
└─ Single database instance
   └─ All requests handled

100-1000 Users
└─ Database auto-scales
   ├─ More connection capacity
   └─ Faster queries

1000+ Users
└─ Enterprise features
   ├─ Read replicas (optional)
   ├─ Advanced caching
   └─ Custom optimization

No manual configuration needed!
Vercel Postgres scales automatically.
```

---

**This architecture ensures your Campus Task Hive application is secure, scalable, and production-ready! 🎉**
