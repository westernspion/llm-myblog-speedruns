import { db } from "./db/index.js";
import { posts } from "./db/schema.js";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("Running migrations...");

  // Create the posts table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      published BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Seed with a sample post if table is empty
  const existing = await db.select().from(posts);
  if (existing.length === 0) {
    await db.insert(posts).values([
      {
        title: "Welcome to My Blog",
        slug: "welcome-to-my-blog",
        excerpt: "First post on the new synthwave-powered blog. Built with Fastify, Next.js, and PostgreSQL.",
        content: `# Welcome

Hey, I'm **Bradley Savoy** — a DevOps/SRE engineer with 15 years in the trenches.

This blog is where I'll share what I've learned about:

- Infrastructure as Code
- Kubernetes & container orchestration
- CI/CD pipelines that actually work
- Monitoring, observability, and incident response
- The occasional war story from production

The stack powering this site: **Next.js** on the frontend, **Fastify + Drizzle** on the backend, **PostgreSQL** for storage — all running in Docker Compose.

Stay tuned.`,
        published: true,
      },
      {
        title: "Docker Compose in Production: Lessons Learned",
        slug: "docker-compose-in-production",
        excerpt: "Unpopular opinion: Docker Compose can work in production for small-to-medium workloads. Here's how.",
        content: `# Docker Compose in Production

I know what you're thinking — *"just use Kubernetes."*

But hear me out. For small teams running a handful of services, Docker Compose with proper monitoring can be a perfectly viable production setup. I've run it successfully for years.

## The Setup

\`\`\`yaml
services:
  app:
    image: myapp:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
\`\`\`

## Key Principles

1. **Always use health checks** — If your service can't tell you it's healthy, you're flying blind.
2. **Pin your image tags** — \`:latest\` in production is asking for trouble.
3. **External volumes for data** — Never store state inside a container.
4. **Log to stdout** — Let your log aggregator handle the rest.

## When to Graduate

Move to Kubernetes when:
- You need multi-node scheduling
- Auto-scaling becomes critical
- Your service mesh requirements grow complex

Until then, Compose gets the job done.`,
        published: true,
      },
      {
        title: "Monitoring That Actually Works",
        slug: "monitoring-that-actually-works",
        excerpt: "After years of alert fatigue, here's the monitoring philosophy I've settled on.",
        content: `# Monitoring That Actually Works

Alert fatigue is real. I've been on teams where we had 500+ alerts firing daily and the response was to mute Slack channels.

Here's the philosophy I use now:

## The Four Golden Signals

Google's SRE book got this right:
- **Latency** — How long requests take
- **Traffic** — How much demand your system is under
- **Errors** — The rate of failed requests
- **Saturation** — How full your resources are

## My Rules

1. **Every alert must be actionable.** If you can't do something about it at 3 AM, it's not an alert — it's a dashboard metric.
2. **Alert on symptoms, not causes.** Users don't care that CPU is at 80%. They care that the page loads in 10 seconds.
3. **Three severity levels max.** Critical (wake someone up), Warning (look at it soon), Info (nice to know).

## The Stack I Use

- **Prometheus** for metrics collection
- **Grafana** for dashboards
- **Alertmanager** for routing
- **Loki** for logs

Keep it simple. Keep it actionable.`,
        published: true,
      },
    ]);
    console.log("Seeded 3 sample posts.");
  }

  console.log("Migrations complete.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
