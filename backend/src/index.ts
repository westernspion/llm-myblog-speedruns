import Fastify from "fastify";
import cors from "@fastify/cors";
import { postRoutes } from "./routes/posts.js";
import { db } from "./db/index.js";
import { posts } from "./db/schema.js";
import { sql } from "drizzle-orm";

const app = Fastify({ logger: true });

// CORS
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
});

// Health check
app.get("/health", async () => ({ status: "ok" }));

// Auto-migrate on startup
async function autoMigrate() {
  app.log.info("Running auto-migration...");
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

  // Seed if empty
  const existing = await db.select().from(posts);
  if (existing.length === 0) {
    app.log.info("Seeding sample posts...");
    await db.insert(posts).values([
      {
        title: "Welcome to My Blog",
        slug: "welcome-to-my-blog",
        excerpt: "First post on the new synthwave-powered blog. Built with Fastify, Next.js, and PostgreSQL.",
        content: `# Welcome\n\nHey, I'm **Bradley Savoy** — a DevOps/SRE engineer with 15 years in the trenches.\n\nThis blog is where I'll share what I've learned about infrastructure, containers, CI/CD, monitoring, and the occasional war story from production.\n\nThe stack powering this site: **Next.js** on the frontend, **Fastify + Drizzle** on the backend, **PostgreSQL** for storage — all running in Docker Compose.\n\nStay tuned.`,
        published: true,
      },
      {
        title: "Docker Compose in Production: Lessons Learned",
        slug: "docker-compose-in-production",
        excerpt: "Unpopular opinion: Docker Compose can work in production for small-to-medium workloads. Here's how.",
        content: `# Docker Compose in Production\n\nI know what you're thinking — *"just use Kubernetes."*\n\nBut hear me out. For small teams running a handful of services, Docker Compose with proper monitoring can be a perfectly viable production setup.\n\n## Key Principles\n\n1. **Always use health checks**\n2. **Pin your image tags**\n3. **External volumes for data**\n4. **Log to stdout**\n\nMove to Kubernetes when you need multi-node scheduling, auto-scaling, or complex service mesh requirements. Until then, Compose gets the job done.`,
        published: true,
      },
      {
        title: "Monitoring That Actually Works",
        slug: "monitoring-that-actually-works",
        excerpt: "After years of alert fatigue, here's the monitoring philosophy I've settled on.",
        content: `# Monitoring That Actually Works\n\nAlert fatigue is real. Here's the philosophy I use now:\n\n## The Four Golden Signals\n\n- **Latency** — How long requests take\n- **Traffic** — How much demand your system is under\n- **Errors** — The rate of failed requests\n- **Saturation** — How full your resources are\n\n## My Rules\n\n1. Every alert must be actionable.\n2. Alert on symptoms, not causes.\n3. Three severity levels max.\n\nKeep it simple. Keep it actionable.`,
        published: true,
      },
    ]);
  }
}

// Register routes
await app.register(postRoutes);

// Start
const port = Number(process.env.PORT) || 4000;

try {
  await autoMigrate();
  await app.listen({ port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
