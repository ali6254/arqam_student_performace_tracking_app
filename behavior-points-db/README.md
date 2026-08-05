# Behavior Points — local database

Runs Postgres locally in Docker with the schema and some sample data already loaded,
so you can start building against a real database immediately. Since production
(Supabase/Neon) is Postgres too, migrating later is just re-running the same schema file.

## Requirements
- Docker Desktop installed and running

## First run

```bash
docker compose up -d
```

On first start, Postgres automatically runs everything in `db/init/` in order:
`001_schema.sql` (tables, indexes, views) then `002_seed.sql` (sample schools, staff,
students, criteria, and a few point entries). This only happens once — if the database
volume already has data, init scripts are skipped.

Copy `.env.example` to `.env` — the local connection string in it already matches
`docker-compose.yml`, no changes needed.

## Connecting

Command line:
```bash
docker compose exec db psql -U app -d behavior_points
```

Or point any GUI client (TablePlus, DBeaver, pgAdmin, Postico) at:
- host: `localhost`
- port: `5432`
- user: `app`
- password: `app_password`
- database: `behavior_points`

## Quick sanity check

```sql
SELECT * FROM student_term_totals;
SELECT * FROM student_point_history WHERE student_id = 2;
```

You should see Ahmed, Lina, and Omar with their seeded totals.

## Resetting local data

```bash
docker compose down -v   # wipes the local volume
docker compose up -d     # re-runs 001_schema.sql and 002_seed.sql fresh
```

## Migrating to production

1. Create a project on Supabase or Neon and grab its connection string.
2. Apply the schema (schema only — **don't** run `002_seed.sql` against prod, that's
   local sample data only):
   ```bash
   psql "postgresql://<user>:<password>@<host>/<database>?sslmode=require" -f db/init/001_schema.sql
   ```
3. Add real schools, terms, criteria, staff, and students through the admin side of
   the app once it's pointed at prod — or write a one-off script if you're bulk-importing
   an existing student list.
4. Update your app's `DATABASE_URL` to the production connection string. Keep using
   `docker compose up -d` locally for day-to-day development against the same schema.

If you ever want to carry actual local data over (not just the seed data) instead of
starting prod empty, use `pg_dump`/`pg_restore` rather than re-running the seed file.
