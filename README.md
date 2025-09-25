# Udacity API Starter (Node + Express + TS + PostgreSQL)

A clean starter that satisfies the typical **README & Requirements** from the Udacity Full Stack JavaScript projects.

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Create .env
cp .env.example .env
# then edit values

# 3) Create Postgres role & DBs (run inside psql)
-- CREATE ROLE and DBs (you can rename to match your .env)
CREATE USER udacity_user WITH PASSWORD 'password';
ALTER USER udacity_user WITH SUPERUSER CREATEDB CREATEROLE LOGIN;
CREATE DATABASE udacity_dev OWNER udacity_user;
CREATE DATABASE udacity_test OWNER udacity_user;

# 4) Run migrations (dev)
npm run db:up

# 5) Start the dev server
npm run dev
```

## What ports does it use?
- **App:** `PORT` from `.env` (default **3000**)
- **Database:** `POSTGRES_PORT` from `.env` (default **5432**)

## How to connect to the database
- Connection details are controlled by environment variables in `.env`.
- `database.json` instructs **db-migrate** to read those env vars for both `dev` and `test`.

## Package installation instructions
See `package.json` for all dependencies. Install with `npm install`.

## Test
```bash
# compiles TypeScript, migrates test DB up, runs Jasmine, then resets test DB
npm test
```

## Notes
- `.env` is already in `.gitignore`.
- Do **not** commit real secrets. Use `.env.example` as a template.
