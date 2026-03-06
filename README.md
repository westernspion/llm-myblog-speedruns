# Bradley Savoy Blog

Synthwave-inspired DevOps/SRE blog running fully local with Docker Compose.

## Opinionated stack

- Frontend: Next.js 14 (App Router, React Server Components)
- Backend: Next.js Route/Server layer with Node.js
- Database: PostgreSQL 16
- Runtime: Docker Compose for local parity

## Quick start

1. Start the app and database:

   ```bash
   docker compose up --build
   ```

2. Open:

   - Local machine: `http://localhost:3000`
   - LAN devices: `http://bbox1.local:3000`

   If mDNS does not resolve, use your server local IP such as `http://192.168.x.x:3000`.

## Services

- `app`: Next.js dev server bound to `0.0.0.0:3000`
- `db`: PostgreSQL on `0.0.0.0:5432`

Seed data is loaded from `sql/init.sql` on first database initialization.
