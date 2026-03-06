# Bradley Savoy's DevOps Blog

A professional, synthwave-inspired blog platform for DevOps and SRE content. Built with modern, opinionated tech stack choices running entirely in Docker containers.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT-based auth
- **Containerization**: Docker Compose
- **Deployment**: Ready for Cloudflare Tunnel

## Features

- 📝 Full CRUD operations for blog posts
- 🏷️ Tag-based post categorization
- 👥 User authentication with JWT
- 🎨 Synthwave aesthetic with subtle line-scan effects
- 📊 View count tracking
- 🚀 Production-ready Docker setup
- 📱 Responsive design

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Database: localhost:5432
```

### Local Development (Without Docker)

1. **Database Setup**
   ```bash
   # Start PostgreSQL (requires local PostgreSQL installation)
   # Update CONNECTION_STRING in .env files
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run db:push  # Initialize database schema
   npm run dev      # Start development server
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev      # Start Next.js dev server
   ```

## Project Structure

```
myblog/
├── backend/              # Express API
│   ├── src/
│   │   ├── db/          # Database schema and migrations
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth and other middleware
│   │   └── index.ts     # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # Reusable components
│   │   ├── lib/         # API utilities
│   │   └── globals.css  # Tailwind styles
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml    # Container orchestration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token (requires auth)

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (requires auth)
- `PUT /api/posts/:id` - Update post (requires auth)
- `DELETE /api/posts/:id` - Delete post (requires auth)

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag (requires auth)
- `DELETE /api/tags/:id` - Delete tag (requires auth)

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
DATABASE_URL=postgresql://bloguser:blogpassword@postgres:5432/myblog
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

### Users
- id (serial, primary key)
- email (varchar, unique)
- password (text, hashed)
- name (varchar)
- isAdmin (boolean)
- createdAt, updatedAt (timestamps)

### Posts
- id (serial, primary key)
- title (varchar)
- slug (varchar, unique)
- content (text)
- excerpt (text)
- authorId (foreign key → users)
- published (boolean)
- viewCount (integer)
- createdAt, updatedAt (timestamps)

### Tags
- id (serial, primary key)
- name (varchar, unique)
- slug (varchar, unique)
- createdAt (timestamp)

### PostTags
- postId (foreign key → posts)
- tagId (foreign key → tags)

## Styling & Design

The blog features a synthwave aesthetic with:
- Dark navy background (#0a0e27)
- Neon color palette (pink, cyan, purple, green)
- Subtle line-scan effect via CSS
- Responsive grid layouts
- Hover effects and smooth transitions

Custom Tailwind colors are defined in `frontend/tailwind.config.js`.

## Deployment with Cloudflare Tunnel

To expose this blog securely to the internet:

```bash
# Install Cloudflare Tunnel
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

cloudflared tunnel create myblog
cloudflared tunnel route dns myblog yourdomain.com
cloudflared tunnel run myblog --url http://localhost:3000
```

## Development Notes

- All TypeScript files use strict mode
- Database migrations are handled via Drizzle Kit
- JWT tokens expire after 7 days
- Passwords are hashed with bcryptjs (10 salt rounds)
- CORS is enabled for local development

## Next Steps

1. Create initial admin user via `/api/auth/register`
2. Log in at `/admin` with credentials
3. Create posts and tags via the API
4. Publish posts from admin dashboard
5. View published posts on homepage

## License

All rights reserved. Bradley Savoy © 2024
