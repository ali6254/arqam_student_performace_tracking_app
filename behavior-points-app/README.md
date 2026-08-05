# Behavior Points — app

Next.js (App Router) app for ISSP / Arqm Academy behavior points, with three portals
(`/admin`, `/staff`, `/student`), Prisma talking to Postgres, and simple signed-cookie
sessions (no auth library).

## Prerequisites

- Node.js 20+
- The `behavior-points-db` project running locally (`docker compose up -d` there first)

## Setup

```bash
npm install
cp .env.example .env.local
```

Generate a real session secret and put it in `.env.local`:
```bash
openssl rand -base64 32
```

Generate the Prisma client (this reads `prisma/schema.prisma` — it does **not**
create or alter any tables, since those already exist from `db/init/001_schema.sql`):
```bash
npx prisma generate
```

Make the seeded accounts loginable (the SQL seed data uses placeholder password
hashes — this upgrades them to a real one and is safe to re-run):
```bash
npm run db:seed
```

Start the app:
```bash
npm run dev
```

## Try it

Visit `http://localhost:3000`. Every seeded account uses the password `password123`:

| Portal  | Email               |
|---------|---------------------|
| Admin   | admin@issp.edu      |
| Staff   | j.carter@issp.edu   |
| Student | ahmed.y@issp.edu    |

Sign in as staff, give Ahmed some points, then sign in as the student (or as admin →
Students → Ahmed) to see the total and history update.

## How the auth works

No NextAuth/Auth.js — three separate tables (`admins`, `staff`, `students`) each with
their own login route and password hash, so a library that assumes one unified users
table would fight the schema more than it'd help. Instead:

- `src/lib/auth.ts` — bcrypt hashing
- `src/lib/session.ts` — signs a small JWT (role, id, schoolId) into an httpOnly cookie
  using `jose` (works in both server actions and Edge middleware)
- `src/middleware.ts` — redirects to the right `/​<role>​/login` if the cookie is
  missing, invalid, or belongs to the wrong role
- `src/lib/actions.ts` — `loginAdmin` / `loginStaff` / `loginStudent` / `logout`

## What's built

- Auth for all 3 roles (admin/staff/student), with deactivated accounts blocked at login
- Admin: create, edit, and activate/deactivate criteria and performance levels (editing
  a performance level's points never rewrites history — past entries keep their
  snapshotted value)
- Admin: create, edit, and activate/deactivate students; create and activate/deactivate staff
- Staff: give-points form with a dependent criteria → performance dropdown, current term
  preselected
- Student: total points + full history for the current term
- Admin: the same total + history view reused as a per-student drill-down
- Admin: **Reports** page — pick a term, download an `.xlsx` of every student's total
  points for it (`/admin/reports`, backed by a route handler at
  `/api/admin/reports/term/[termId]`)

## Natural next steps

- Password reset flow
- Pagination/search on the students and staff lists once rosters get large
- A per-student, per-criteria breakdown in the Excel export (currently one row per
  student with their total — the `student_point_history` view has everything needed
  to add a second sheet with line-item detail)

## Migrating to production

Same as the database project: point `DATABASE_URL` at your Supabase/Neon connection
string, run `001_schema.sql` against it once, deploy the app (Vercel is the natural fit
for Next.js), and set `SESSION_SECRET`/`DATABASE_URL` as environment variables there
instead of in `.env.local`.
