import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import tagRoutes from './routes/tags';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

async function runMigrations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        published BOOLEAN DEFAULT FALSE NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        author_id INTEGER REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
        PRIMARY KEY (post_id, tag_id)
      );
    `);
    console.log('[db] Migrations complete');
  } finally {
    client.release();
    await pool.end();
  }
}

async function seedAdmin() {
  const bcrypt = await import('bcryptjs');
  const { db } = await import('./db');
  const { users } = await import('./db/schema');
  const { eq } = await import('drizzle-orm');

  const email = process.env.ADMIN_EMAIL || 'brad.savoy@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length === 0) {
    const hash = await bcrypt.default.hash(password, 12);
    await db.insert(users).values({ email, passwordHash: hash });
    console.log(`[seed] Admin user created: ${email}`);
  }
}

async function seedSamplePosts() {
  const { db } = await import('./db');
  const { posts, tags, postTags } = await import('./db/schema');
  const { users } = await import('./db/schema');
  const { eq } = await import('drizzle-orm');
  const slugify = (await import('slugify')).default;

  const adminEmail = process.env.ADMIN_EMAIL || 'brad.savoy@gmail.com';
  const [user] = await db.select().from(users).where(eq(users.email, adminEmail));
  if (!user) return;

  const existingPosts = await db.select().from(posts);
  if (existingPosts.length > 0) return;

  const samplePosts = [
    {
      title: 'Building a Zero-Downtime Deployment Pipeline with Kubernetes',
      slug: 'zero-downtime-deployment-kubernetes',
      excerpt: "After 15 years of watching deployments take down production, here's the architecture that finally let us ship 40+ times per day without breaking a sweat.",
      content: `# Building a Zero-Downtime Deployment Pipeline with Kubernetes

After 15 years in the industry, I've seen my share of 3am pages. Most of them came down to one thing: deployments. This post covers the exact pipeline we built to go from "fingers crossed" deployments to shipping 40+ times per day with confidence.

## The Problem

Every deployment was a prayer session. We'd freeze the DB, run migrations, deploy the app, pray, and roll back if things went sideways. On a good day this took 20 minutes. On a bad day... let's not talk about that.

## The Solution: Blue/Green with Automated Canary Analysis

The core insight is that you need to decouple *deployment* from *release*. Here's the stack:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: backend-api
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: {duration: 2m}
      - analysis:
          templates:
          - templateName: error-rate
      - setWeight: 50
      - pause: {duration: 5m}
      - setWeight: 100
\`\`\`

## The Results

- Deploy frequency: 3/week → 40+/day
- MTTR: 45 minutes → 4 minutes
- Incident rate: dropped 70% in 6 months

The key wasn't the tooling—it was shifting the culture to treat deployments as a routine, boring event.`,
      tags: ['kubernetes', 'devops', 'ci-cd'],
    },
    {
      title: 'Prometheus + Grafana: The Observability Stack You Actually Want',
      slug: 'prometheus-grafana-observability',
      excerpt: "A pragmatic guide to setting up Prometheus and Grafana that won't leave you drowning in cardinality issues six months later.",
      content: `# Prometheus + Grafana: The Observability Stack You Actually Want

I've set up Prometheus more times than I can count. Here's what I wish someone had told me the first time.

## Start With the Four Golden Signals

Before you instrument anything, internalize Google's four golden signals:

1. **Latency** — How long requests take
2. **Traffic** — How much demand your system is handling  
3. **Errors** — Rate of failed requests
4. **Saturation** — How full your system is

Everything else is secondary.

## Recording Rules That Save Your Dashboards

High-cardinality metrics will kill your Prometheus. Use recording rules aggressively:

\`\`\`yaml
groups:
  - name: api_aggregates
    interval: 30s
    rules:
      - record: job:http_requests_total:rate5m
        expr: sum by (job, status_code) (rate(http_requests_total[5m]))
      - record: job:http_request_duration_p99
        expr: histogram_quantile(0.99, sum by (job, le) (rate(http_request_duration_seconds_bucket[5m])))
\`\`\`

## Alerting Done Right

Page at 2am only for things that need human intervention *right now*. Everything else goes to Slack. The on-call engineer's sleep is a reliability metric too.`,
      tags: ['monitoring', 'prometheus', 'sre'],
    },
    {
      title: 'Terraform at Scale: Lessons from Managing 200+ AWS Accounts',
      slug: 'terraform-at-scale-200-aws-accounts',
      excerpt: 'State management, module versioning, and the org structure that kept us sane when Terraform stopped being a weekend project.',
      content: `# Terraform at Scale: Lessons from Managing 200+ AWS Accounts

When we started, Terraform was a single state file. By the time I left, we had 200+ AWS accounts and a platform team of 8. Here's what we learned.

## State Isolation is Non-Negotiable

The biggest mistake teams make is keeping everything in one state file. Blast radius is real.

\`\`\`
accounts/
  prod/
    networking/
    compute/
    data/
modules/
  vpc/
  eks-cluster/
  rds/
\`\`\`

## Module Registry Pattern

Treat your Terraform modules like software. Version them. Tag releases. Have a changelog.

\`\`\`hcl
module "eks" {
  source = "git::https://github.com/myorg/terraform-modules//eks?ref=v2.3.1"
  cluster_name  = "prod-us-east-1"
  node_count    = 10
  instance_type = "m6i.xlarge"
}
\`\`\`

Never point to \`main\`. Ever.

## Drift Detection

Run \`terraform plan\` on all your stacks nightly and alert on drift. You'll be amazed what accumulates in production when no one's looking.`,
      tags: ['terraform', 'aws', 'infrastructure'],
    },
  ];

  for (const post of samplePosts) {
    const [inserted] = await db
      .insert(posts)
      .values({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
      })
      .returning();

    for (const tagName of post.tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      let [tag] = await db.select().from(tags).where(eq(tags.slug, tagSlug));
      if (!tag) {
        [tag] = await db.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
      }
      await db.insert(postTags).values({ postId: inserted.id, tagId: tag.id }).onConflictDoNothing();
    }
  }
  console.log('[seed] Sample posts created');
}

async function start() {
  await runMigrations();
  await seedAdmin();
  await seedSamplePosts();

  app.listen(PORT, () => {
    console.log(`[server] Running on port ${PORT}`);
  });
}

start().catch(console.error);
