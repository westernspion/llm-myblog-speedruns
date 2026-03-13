# DevOps/SRE Engineer Blog - Specification

## Project Overview

- **Project Name**: SRE Blog
- **Type**: Personal blog web application
- **Core Functionality**: A blog platform for a DevOps/SRE engineer with admin capabilities, visitor analytics, and synthwave-inspired design
- **Target Users**: Technical audience, fellow engineers, potential employers

## Tech Stack

- **Backend**: Python with FastAPI
- **Database**: PostgreSQL
- **Frontend**: HTMX + TailwindCSS (served by FastAPI)
- **Authentication**: Session-based with secure cookies
- **Markdown**: python-markdown with highlight.js for code syntax
- **Deployment**: Docker Compose (local)

## UI/UX Specification

### Layout Structure

- **Header**: Fixed top navigation with site title, nav links (Home, Blog, About), admin link (when not logged in)
- **Main Content**: Centered container, max-width 800px
- **Footer**: Site stats display, copyright

### Visual Design - Synthwave Theme

**Color Palette**:
- Background: `#0d0221` (deep purple-black)
- Primary: `#ff00ff` (magenta)
- Secondary: `#00ffff` (cyan)
- Accent: `#ff6b00` (neon orange)
- Text Primary: `#e0e0e0`
- Text Secondary: `#888888`
- Card Background: `#1a0a2e`
- Border: `#2d1b4e`

**Typography**:
- Headings: "Orbitron" (Google Font) - futuristic, tech feel
- Body: "Roboto Mono" - monospace for that terminal aesthetic
- Code: "Fira Code"

**Visual Effects**:
- Subtle scanline overlay (CSS pseudo-element with repeating gradient)
- Glow effects on headings (text-shadow with primary color)
- Neon border highlights on cards (box-shadow)
- Smooth hover transitions (0.3s ease)

### Components

1. **Post Card**: Title, date, excerpt, read more link, glow border on hover
2. **Markdown Editor**: Textarea with preview toggle, toolbar for common formatting
3. **Admin Panel**: Dashboard with stats, post list, create/edit forms
4. **Statistics Panel**: Charts/tables for visitor data, date range selector
5. **Visitor Counter**: Public display at footer

## Database Schema

### Users Table
- id (UUID, PK)
- username (VARCHAR, unique)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)

### Posts Table
- id (UUID, PK)
- title (VARCHAR)
- slug (VARCHAR, unique)
- content (TEXT - Markdown)
- published (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Activity Logs Table
- id (UUID, PK)
- action (VARCHAR)
- entity_type (VARCHAR)
- entity_id (UUID)
- user_id (UUID, nullable)
- details (JSON)
- created_at (TIMESTAMP)

### Visitors Table
- id (UUID, PK)
- session_id (VARCHAR)
- ip_address (VARCHAR)
- user_agent (VARCHAR)
- first_visit (TIMESTAMP)
- last_visit (TIMESTAMP)
- page_views (INTEGER)

### Page Views Table
- id (UUID, PK)
- visitor_id (UUID, FK)
- path (VARCHAR)
- created_at (TIMESTAMP)

## Functionality Specification

### Public Features
1. **Home Page**: Recent posts list, site description
2. **Blog List**: Paginated list of published posts
3. **Post View**: Full Markdown-rendered post with syntax highlighting
4. **Visitor Tracking**: Track each unique visitor, count page views
5. **Public Stats**: Total visitors displayed at footer

### Admin Features
1. **Login**: Secure authentication
2. **Dashboard**: Overview stats (total visitors, unique visitors, page views)
3. **Post Management**: Create, edit, delete, publish/unpublish
4. **Markdown Editor**: Live preview, toolbar
5. **Detailed Analytics**: Time-range selectable, exportable data
6. **Activity Log**: View all admin actions

### Activity Logging
- Every page view logged
- All admin actions (login, create/update/delete posts) logged
- Log includes: action type, entity, user, timestamp, details

## API Endpoints

### Public
- `GET /` - Home page
- `GET /blog` - Blog list
- `GET /blog/{slug}` - Single post
- `GET /stats` - Public visitor count

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/login` - Login page
- `POST /admin/login` - Login action
- `POST /admin/logout` - Logout action
- `GET /admin/posts` - Post list
- `GET /admin/posts/new` - New post form
- `POST /admin/posts` - Create post
- `GET /admin/posts/{id}/edit` - Edit form
- `POST /admin/posts/{id}` - Update post
- `POST /admin/posts/{id}/delete` - Delete post
- `GET /admin/stats` - Detailed statistics
- `GET /admin/activity` - Activity log

## Sample Content

Create 3-5 sample blog posts on topics relevant to SRE/DevOps:
1. "My Journey into SRE" - Personal intro
2. "Building a Home Lab for Learning DevOps" - Technical tutorial
3. "Infrastructure as Code: Lessons Learned" - Experience/advice
4. "Observability 101: Getting Started" - Educational
5. "Automating Deployments with GitHub Actions" - Tutorial

## Acceptance Criteria

1. ✅ Site runs via Docker Compose with single command
2. ✅ Admin can log in and manage posts
3. ✅ Markdown posts render with syntax highlighting
4. ✅ Visitor tracking works (unique + total counts)
5. ✅ Public stats shown at footer
6. ✅ Admin can view detailed statistics with date filtering
7. ✅ Activity logging captures all relevant actions
8. ✅ Synthwave aesthetic applied consistently
9. ✅ Site has sample content on first launch
10. ✅ Admin URL and credentials provided after setup
