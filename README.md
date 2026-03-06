# Bradley Savoy's Blog

A professional, synthwave-themed personal blog for a DevOps/SRE engineer with 15 years of experience. Built with Next.js 14, Express, Drizzle ORM, and PostgreSQL — fully containerized with Docker Compose.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Express, TypeScript, Drizzle ORM |
| Database | PostgreSQL 16 |
| Runtime | Docker Compose |

## Quick Start

```bash
docker compose up --build
```

- Frontend: http://localhost:3000 (or http://bbox1.local:3000 on LAN)
- Backend API: http://localhost:3001
- Admin panel: http://localhost:3000/admin

## Admin Credentials

Default credentials (set via environment variables in docker-compose.yml):

- **Email:** brad.savoy@gmail.com
- **Password:** admin123

Change these in production!

## Features

- Synthwave aesthetic with subtle CRT line-scan effect
- Markdown blog posts with syntax-highlighted code blocks
- Tag system
- Admin panel: create, edit, delete posts with live preview
- JWT authentication
- Auto-seeded sample posts on first run
- Responsive design
