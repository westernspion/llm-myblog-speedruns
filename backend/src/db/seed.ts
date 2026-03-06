import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const samplePosts = [
  {
    title: 'Building a Zero-Downtime Deployment Pipeline with Kubernetes',
    slug: 'zero-downtime-deployment-kubernetes',
    excerpt: 'After 15 years of watching deployments take down production, here\'s the architecture that finally let us ship 40+ times per day without breaking a sweat.',
    content: `# Building a Zero-Downtime Deployment Pipeline with Kubernetes

After 15 years in the industry, I've seen my share of 3am pages. Most of them came down to one thing: deployments. This post covers the exact pipeline we built at my last company to go from "fingers crossed" deployments to shipping 40+ times per day with confidence.

## The Problem

Every deployment was a prayer session. We'd freeze the DB, run migrations, deploy the app, pray, and roll back if things went sideways. On a good day this took 20 minutes. On a bad day... let's not talk about that.

## The Solution: Blue/Green with Automated Canary Analysis

The core insight is that you need to decouple *deployment* from *release*. Here's the stack:

\`\`\`yaml
# Argo Rollouts canary config
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

The key wasn't the tooling—it was shifting the culture to treat deployments as a routine, boring event. That's when you know you've won.`,
    tags: ['kubernetes', 'devops', 'ci-cd'],
  },
  {
    title: 'Prometheus + Grafana: The Observability Stack You Actually Want',
    slug: 'prometheus-grafana-observability',
    excerpt: 'A pragmatic guide to setting up Prometheus and Grafana that won\'t leave you drowning in cardinality issues six months later.',
    content: `# Prometheus + Grafana: The Observability Stack You Actually Want

I've set up Prometheus more times than I can count. Here's what I wish someone had told me the first time.

## Start With the Four Golden Signals

Before you instrument anything, internalize Google's four golden signals:

1. **Latency** — How long requests take
2. **Traffic** — How much demand your system is handling
3. **Errors** — Rate of failed requests
4. **Saturation** — How full your system is

Everything else is secondary. Start here.

## The Recording Rules That Save Your Dashboards

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

AlertManager routing is where most teams mess up. Here's a clean structure:

- Page at 2am only for things that need human intervention *right now*
- Everything else goes to Slack/email
- Use inhibition rules to suppress child alerts when parent systems are down

The on-call engineer's sleep is a reliability metric too.`,
    tags: ['monitoring', 'prometheus', 'sre'],
  },
  {
    title: 'Terraform at Scale: Lessons from Managing 200+ AWS Accounts',
    slug: 'terraform-at-scale-200-aws-accounts',
    excerpt: 'State management, module versioning, and the org structure that kept us sane when Terraform stopped being a weekend project.',
    content: `# Terraform at Scale: Lessons from Managing 200+ AWS Accounts

When we started, Terraform was a single state file. By the time I left, we had 200+ AWS accounts and a platform team of 8 managing infrastructure for 400+ engineers. Here's what we learned.

## State Isolation is Non-Negotiable

The biggest mistake teams make is keeping everything in one state file. Blast radius is real.

Structure your state like this:

\`\`\`
accounts/
  prod/
    networking/
    compute/
    data/
  staging/
    ...
modules/
  vpc/
  eks-cluster/
  rds/
\`\`\`

## The Module Registry Pattern

Treat your Terraform modules like software. Version them. Tag releases. Have a changelog.

\`\`\`hcl
module "eks" {
  source  = "git::https://github.com/myorg/terraform-modules//eks?ref=v2.3.1"
  
  cluster_name    = "prod-us-east-1"
  node_count      = 10
  instance_type   = "m6i.xlarge"
}
\`\`\`

Never point to \`main\`. Ever.

## Drift Detection

Set up a CI job that runs \`terraform plan\` on all your stacks nightly and alerts on drift. You'll be amazed what manual changes accumulate in production environments when no one's looking.`,
    tags: ['terraform', 'aws', 'infrastructure'],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'brad.savoy@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(adminPassword, 12);

    await client.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      [adminEmail, hash]
    );

    const userRes = await client.query(`SELECT id FROM users WHERE email = $1`, [adminEmail]);
    const userId = userRes.rows[0].id;

    const tagMap: Record<string, number> = {};
    const allTags = [...new Set(samplePosts.flatMap(p => p.tags))];
    for (const tag of allTags) {
      const res = await client.query(
        `INSERT INTO tags (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING RETURNING id`,
        [tag, tag]
      );
      if (res.rows.length > 0) {
        tagMap[tag] = res.rows[0].id;
      } else {
        const existing = await client.query(`SELECT id FROM tags WHERE slug = $1`, [tag]);
        tagMap[tag] = existing.rows[0].id;
      }
    }

    for (const post of samplePosts) {
      const res = await client.query(
        `INSERT INTO posts (title, slug, excerpt, content, published, published_at, author_id)
         VALUES ($1, $2, $3, $4, true, NOW(), $5)
         ON CONFLICT (slug) DO NOTHING RETURNING id`,
        [post.title, post.slug, post.excerpt, post.content, userId]
      );
      if (res.rows.length > 0) {
        const postId = res.rows[0].id;
        for (const tag of post.tags) {
          await client.query(
            `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [postId, tagMap[tag]]
          );
        }
      }
    }

    console.log('Seed complete');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
