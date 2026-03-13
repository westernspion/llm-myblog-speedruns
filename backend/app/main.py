import os
import uuid
import json
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path

from fastapi import FastAPI, Request, Response, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Boolean,
    DateTime,
    Integer,
    Text,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker, relationship, declarative_base, Session
import bcrypt
from pydantic import BaseModel
import markdown
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://bloguser:blogpass@localhost:5432/blogdb"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


security = HTTPBasic()


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Post(Base):
    __tablename__ = "posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = Column(String(50), nullable=False)
    entity_type = Column(String(50))
    entity_id = Column(UUID(as_uuid=True))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(100), unique=True, nullable=False)
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    first_visit = Column(DateTime, default=datetime.utcnow)
    last_visit = Column(DateTime, default=datetime.utcnow)
    page_views = Column(Integer, default=0)


class PageView(Base):
    __tablename__ = "page_views"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visitor_id = Column(UUID(as_uuid=True), ForeignKey("visitors.id"))
    path = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="SRE Blog")

static_path = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPBasicCredentials = Depends(security), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


def log_activity(
    db: Session,
    action: str,
    entity_type: Optional[str] = None,
    entity_id: Optional[uuid.UUID] = None,
    user_id: Optional[uuid.UUID] = None,
    details: Optional[dict] = None,
):
    log = ActivityLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user_id,
        details=json.dumps(details) if details else None,
    )
    db.add(log)
    db.commit()


def get_or_create_visitor(db: Session, request: Request):
    session_id = request.cookies.get("visitor_id")
    if session_id:
        visitor = db.query(Visitor).filter(Visitor.session_id == session_id).first()
        if visitor:
            visitor.last_visit = datetime.utcnow()
            visitor.page_views += 1
            db.commit()
            return visitor

    visitor = Visitor(
        session_id=str(uuid.uuid4()),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:500],
    )
    db.add(visitor)
    db.commit()
    return visitor


def track_page_view(db: Session, visitor: Visitor, path: str):
    page_view = PageView(visitor_id=visitor.id, path=path)
    db.add(page_view)
    db.commit()


def render_markdown(content: str) -> str:
    md = markdown.Markdown(extensions=["fenced_code", "codehilite", "tables", "nl2br"])
    return md.convert(content)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request, db: Session = Depends(get_db)):
    visitor = get_or_create_visitor(db, request)
    track_page_view(db, visitor, "/")

    posts = (
        db.query(Post)
        .filter(Post.published == True)
        .order_by(Post.created_at.desc())
        .limit(5)
        .all()
    )

    total_visitors = db.query(func.count(Visitor.id)).scalar()

    return templates.TemplateResponse(
        "index.html",
        {"request": request, "posts": posts, "total_visitors": total_visitors},
    )


@app.get("/blog", response_class=HTMLResponse)
async def blog(request: Request, db: Session = Depends(get_db)):
    visitor = get_or_create_visitor(db, request)
    track_page_view(db, visitor, "/blog")

    posts = (
        db.query(Post)
        .filter(Post.published == True)
        .order_by(Post.created_at.desc())
        .all()
    )
    total_visitors = db.query(func.count(Visitor.id)).scalar()

    return templates.TemplateResponse(
        "blog.html",
        {"request": request, "posts": posts, "total_visitors": total_visitors},
    )


@app.get("/blog/{slug}", response_class=HTMLResponse)
async def post(request: Request, slug: str, db: Session = Depends(get_db)):
    visitor = get_or_create_visitor(db, request)
    track_page_view(db, visitor, f"/blog/{slug}")

    post = db.query(Post).filter(Post.slug == slug, Post.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.content_html = render_markdown(post.content)
    total_visitors = db.query(func.count(Visitor.id)).scalar()

    return templates.TemplateResponse(
        "post.html",
        {"request": request, "post": post, "total_visitors": total_visitors},
    )


@app.get("/stats", response_class=HTMLResponse)
async def public_stats(request: Request, db: Session = Depends(get_db)):
    visitor = get_or_create_visitor(db, request)
    track_page_view(db, visitor, "/stats")

    total_visitors = db.query(func.count(Visitor.id)).scalar()
    total_page_views = db.query(func.count(PageView.id)).scalar()

    return templates.TemplateResponse(
        "stats.html",
        {
            "request": request,
            "total_visitors": total_visitors,
            "total_page_views": total_page_views,
        },
    )


def get_user_from_session(request: Request, db: Session):
    cookie = request.cookies.get("admin_session")
    if cookie:
        try:
            user = db.query(User).filter(User.id == uuid.UUID(cookie)).first()
            if user:
                return user
        except:
            pass
    return None


@app.get("/admin", response_class=HTMLResponse)
async def admin(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    total_visitors = db.query(func.count(Visitor.id)).scalar()
    unique_visitors = db.query(func.count(func.distinct(Visitor.session_id))).scalar()
    total_page_views = db.query(func.count(PageView.id)).scalar()

    recent_activities = (
        db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(20).all()
    )

    return templates.TemplateResponse(
        "admin/dashboard.html",
        {
            "request": request,
            "user": user,
            "posts": posts,
            "total_visitors": total_visitors,
            "unique_visitors": unique_visitors,
            "total_page_views": total_page_views,
            "recent_activities": recent_activities,
        },
    )


@app.get("/admin/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("admin/login.html", {"request": request})


class RequestCredentialExtractor:
    def __init__(self, request: Request):
        self.request = request

    @property
    def username(self):
        return self.request.session.get("username", "")

    @property
    def password(self):
        return self.request.session.get("password", "")


@app.post("/admin/login", response_class=HTMLResponse)
async def login(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    username = form.get("username")
    password = form.get("password")

    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        return templates.TemplateResponse(
            "admin/login.html", {"request": request, "error": "Invalid credentials"}
        )

    log_activity(db, "login", user_id=user.id, details={"username": username})

    response = RedirectResponse("/admin", status_code=302)
    response.set_cookie("admin_session", str(user.id), httponly=True, max_age=86400)
    return response


@app.post("/admin/logout", response_class=HTMLResponse)
async def logout(request: Request, db: Session = Depends(get_db)):
    response = RedirectResponse("/")
    response.delete_cookie("admin_session")
    return response


@app.get("/admin/posts/new", response_class=HTMLResponse)
async def new_post(request: Request, db: Session = Depends(get_db)):
    try:
        user = get_user_from_session
    except:
        return RedirectResponse("/admin/login")

    return templates.TemplateResponse(
        "admin/post_form.html", {"request": request, "user": user, "post": None}
    )


@app.post("/admin/posts", response_class=HTMLResponse)
async def create_post(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    form = await request.form()
    title = form.get("title")
    slug = form.get("slug")
    content = form.get("content")
    published = form.get("published") == "on"

    post = Post(title=title, slug=slug, content=content, published=published)
    db.add(post)
    db.commit()

    log_activity(db, "create", "post", post.id, user.id, {"title": title, "slug": slug})

    return RedirectResponse("/admin", status_code=302)


@app.get("/admin/posts/{post_id}/edit", response_class=HTMLResponse)
async def edit_post(request: Request, post_id: str, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    post = db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return templates.TemplateResponse(
        "admin/post_form.html", {"request": request, "user": user, "post": post}
    )


@app.post("/admin/posts/{post_id}", response_class=HTMLResponse)
async def update_post(request: Request, post_id: str, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    post = db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    form = await request.form()
    post.title = form.get("title")
    post.slug = form.get("slug")
    post.content = form.get("content")
    post.published = form.get("published") == "on"
    post.updated_at = datetime.utcnow()

    db.commit()
    log_activity(db, "update", "post", post.id, user.id, {"title": post.title})

    return RedirectResponse("/admin", status_code=302)


@app.post("/admin/posts/{post_id}/delete", response_class=HTMLResponse)
async def delete_post(request: Request, post_id: str, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    post = db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    log_activity(db, "delete", "post", post.id, user.id, {"title": post.title})

    db.delete(post)
    db.commit()

    return RedirectResponse("/admin", status_code=302)


@app.get("/admin/stats", response_class=HTMLResponse)
async def admin_stats(request: Request, days: int = 30, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    since = datetime.utcnow() - timedelta(days=days)

    visitors = db.query(Visitor).filter(Visitor.first_visit >= since).all()
    unique_visitors = len(visitors)
    total_page_views = db.query(PageView).filter(PageView.created_at >= since).count()

    daily_stats = []
    for i in range(days):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        day_visitors = (
            db.query(Visitor)
            .filter(Visitor.first_visit >= day_start, Visitor.first_visit < day_end)
            .count()
        )

        day_page_views = (
            db.query(PageView)
            .filter(PageView.created_at >= day_start, PageView.created_at < day_end)
            .count()
        )

        daily_stats.append(
            {
                "date": day_start.strftime("%Y-%m-%d"),
                "visitors": day_visitors,
                "page_views": day_page_views,
            }
        )

    daily_stats.reverse()

    return templates.TemplateResponse(
        "admin/stats.html",
        {
            "request": request,
            "user": user,
            "days": days,
            "unique_visitors": unique_visitors,
            "total_page_views": total_page_views,
            "daily_stats": daily_stats,
        },
    )


@app.get("/admin/activity", response_class=HTMLResponse)
async def admin_activity(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_session(request, db)
    if not user:
        return RedirectResponse("/admin/login")

    activities = (
        db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(100).all()
    )

    return templates.TemplateResponse(
        "admin/activity.html",
        {"request": request, "user": user, "activities": activities},
    )


def init_db():
    db = SessionLocal()
    existing_user = db.query(User).first()
    if not existing_user:
        admin_user = User(username="admin", password_hash=hash_password("sreblog2026"))
        db.add(admin_user)

        sample_posts = [
            Post(
                title="My Journey into SRE",
                slug="my-journey-into-sre",
                content="""# My Journey into SRE

Welcome to my corner of the internet! I'm a DevOps/SRE engineer with over 15 years of experience in the industry.

## How It All Started

It began with a fascination for automation and making things run smoother. I started as a systems administrator, but quickly realized that the real magic was in writing scripts and automating repetitive tasks.

## What SRE Means to Me

Site Reliability Engineering isn't just a job title—it's a philosophy. It's about:

- **Measuring everything** - You can't improve what you can't measure
- **Embracing failure** - Things will break; it's how we respond that matters
- **Continuous improvement** - Always looking for ways to do better

## What You'll Find Here

On this blog, I'll share my experiences, tutorials, and thoughts on:

1. Infrastructure as Code
2. Observability and monitoring
3. CI/CD pipelines
4. Cloud architecture
5. And whatever else catches my interest!

Feel free to look around, and don't hesitate to reach out if you have questions.
""",
                published=True,
            ),
            Post(
                title="Building a Home Lab for Learning DevOps",
                slug="building-home-lab-devops",
                content="""# Building a Home Lab for Learning DevOps

Every DevOps engineer needs a playground. Here's how I set up mine.

## The Hardware

I started with modest hardware that you probably already have:

- **Old Desktop**: 16GB RAM, quad-core CPU
- **Raspberry Pi 4**: 8GB RAM (for lightweight services)
- **Network Switch**: Managed switch for VLANs

## The Software Stack

### Proxmox VE

This is my virtualization platform of choice. It runs on the old desktop and lets me spin up VMs quickly.

```bash
# Spin up a new VM
qm create 100 --name ubuntu-template --memory 4096 --cores 2
```

### Kubernetes (k3s)

For container orchestration, k3s is perfect for home labs:

```bash
curl -sfL https://get.k3s.io | sh -
```

## Services I Run

- **GitLab CE**: Self-hosted Git repository
- **Jenkins**: CI/CD pipelines
- **Prometheus + Grafana**: Monitoring stack
- **Traefik**: Reverse proxy
- **Portainer**: Container management

## Lessons Learned

1. Start small and iterate
2. Document everything
3. Back up before breaking things
4. Join communities (r/homelab is great!)

Happy homelabbing!
""",
                published=True,
            ),
            Post(
                title="Infrastructure as Code: Lessons Learned",
                slug="infrastructure-as-code-lessons",
                content="""# Infrastructure as Code: Lessons Learned

After years of managing infrastructure, here are the hard-earned lessons about IaC.

## Start Simple

Don't try to refactor everything at once. Pick one small piece and start there.

## Version Control is Non-Negotiable

Your IaC should be in Git. Every change is a commit. This gives you:

- Audit trail
- Rollback capability  
- Code review process

## Idempotency Matters

Your scripts should produce the same result regardless of how many times you run them.

```python
# Good: idempotent
resource "aws_security_group" "web" {
  name = "web-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }
}

# Bad: creates new resource each run
resource "aws_security_group" "web" {
  name = "web-sg-${random_id.random.hex}"
}
```

## State Management

For Terraform, remote state is a must:

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
  }
}
```

## Testing

Yes, you can test infrastructure code:

- **Terratest** for Terraform
- **Checkov** for security scanning
- **serverspec** for server validation

## Final Thoughts

IaC is a journey, not a destination. Keep learning, keep automating!
""",
                published=True,
            ),
            Post(
                title="Observability 101: Getting Started",
                slug="observability-101",
                content="""# Observability 101: Getting Started

The three pillars of observability: **Logs**, **Metrics**, and **Traces**.

## Why Observability?

When something breaks in production, you need to answer:

1. What's broken?
2. Why is it broken?
3. When did it break?
4. Who does it affect?

## Logs

Structured JSON logs are your friend:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "error",
  "service": "api",
  "message": "Request failed",
  "request_id": "abc123",
  "error": "Connection timeout"
}
```

## Metrics

Use Prometheus format:

```prometheus
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1423
```

## Traces

Distributed tracing shows the flow across services:

- **Jaeger**: Open source tracing
- **Zipkin**: Another popular option
- **AWS X-Ray**: If you're on AWS

## The Golden Signals

Google's SRE book recommends monitoring these:

1. **Latency** - How long does it take?
2. **Traffic** - How much demand?
3. **Errors** - What's failing?
4. **Saturation** - How full is the tank?

Start with these, and you'll have a solid foundation!
""",
                published=True,
            ),
            Post(
                title="Automating Deployments with GitHub Actions",
                slug="github-actions-deployments",
                content="""# Automating Deployments with GitHub Actions

Let's build a CI/CD pipeline that actually works!

## Basic Workflow Structure

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: ./deploy.sh
```

## Secrets Management

Never hardcode secrets! Use GitHub Secrets:

```yaml
- name: Deploy to AWS
  run: |
    aws s3 sync build/ s3://${{ secrets.S3_BUCKET }}
```

## Environments

Use GitHub Environments for protection:

```yaml
environment:
  name: production
  url: https://example.com
  reviewers:
    - team-leads
```

## My Best Practices

1. **Fail fast** - Run tests before deployment
2. **Use caching** - Speed up builds
3. **Keep it simple** - Complex pipelines break
4. **Monitor everything** - Track deployment success

## Going Further

Consider adding:
- **Slack notifications** for deployment status
- **Automated rollbacks** on failure
- **Canary deployments** for gradual rollouts

Happy deploying!
""",
                published=True,
            ),
        ]

        for post in sample_posts:
            db.add(post)

        db.commit()
        print("Initialized database with admin user and sample posts")

    db.close()


@app.on_event("startup")
async def startup():
    init_db()
