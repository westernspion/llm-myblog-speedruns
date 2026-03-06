import { db } from "@/lib/db";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
};

export type BlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
};

declare global {
  // eslint-disable-next-line no-var
  var postsSchemaReady: boolean | undefined;
}

function slugify(input: string): string {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized.length > 0 ? normalized : "post";
}

function toBlogPost(row: {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published_at: Date;
}): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags,
    publishedAt: row.published_at.toISOString()
  };
}

function normalizeExcerpt(excerpt: string, content: string): string {
  if (excerpt.trim().length > 0) {
    return excerpt.trim();
  }

  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.slice(0, 180);
}

async function ensurePostsSchema() {
  if (!db || global.postsSchemaReady) {
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      tags TEXT[] NOT NULL DEFAULT '{}',
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query("ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT");
  await db.query("ALTER TABLE posts ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT ''");

  await db.query(`
    UPDATE posts
    SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL OR slug = ''
  `);

  await db.query(`
    UPDATE posts
    SET excerpt = left(regexp_replace(content, '\\s+', ' ', 'g'), 180)
    WHERE excerpt = '' AND content <> ''
  `);

  await db.query("CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique_idx ON posts(slug)");
  global.postsSchemaReady = true;
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  if (!db) {
    return [];
  }

  try {
    await ensurePostsSchema();

    const result = await db.query<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
      published_at: Date;
    }>(
      `SELECT id, slug, title, excerpt, content, tags, published_at
       FROM posts
       ORDER BY published_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(toBlogPost);
  } catch {
    return [];
  }
}

export async function getPostByPathSegment(pathSegment: string): Promise<BlogPost | null> {
  if (!db) {
    return null;
  }

  const numericMatch = pathSegment.match(/^(\d+)/);
  const id = numericMatch ? Number.parseInt(numericMatch[1], 10) : null;

  try {
    await ensurePostsSchema();

    if (id !== null) {
      const byId = await db.query<{
        id: number;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        tags: string[];
        published_at: Date;
      }>(
        `SELECT id, slug, title, excerpt, content, tags, published_at
         FROM posts
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (byId.rows.length > 0) {
        return toBlogPost(byId.rows[0]);
      }
    }

    const allPosts = await db.query<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
      published_at: Date;
    }>(
      `SELECT id, slug, title, excerpt, content, tags, published_at
       FROM posts
       ORDER BY published_at DESC
       LIMIT 200`
    );

    const normalized = pathSegment.toLowerCase();
    const match = allPosts.rows.find((row) => row.slug === normalized);
    return match ? toBlogPost(match) : null;
  } catch {
    return null;
  }
}

export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  return getRecentPosts(200);
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  if (!db) {
    return null;
  }

  try {
    await ensurePostsSchema();
    const result = await db.query<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
      published_at: Date;
    }>(
      `SELECT id, slug, title, excerpt, content, tags, published_at
       FROM posts
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    return result.rows.length > 0 ? toBlogPost(result.rows[0]) : null;
  } catch {
    return null;
  }
}

export async function createPost(input: BlogPostInput): Promise<BlogPost | null> {
  if (!db) {
    return null;
  }

  const baseSlug = slugify(input.title);

  try {
    await ensurePostsSchema();

    let attempt = 0;
    while (attempt < 10) {
      const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
      const slug = `${baseSlug}${suffix}`;

      const result = await db.query<{
        id: number;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        tags: string[];
        published_at: Date;
      }>(
        `INSERT INTO posts (slug, title, excerpt, content, tags)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id, slug, title, excerpt, content, tags, published_at`,
        [slug, input.title.trim(), normalizeExcerpt(input.excerpt, input.content), input.content.trim(), input.tags]
      );

      if (result.rows.length > 0) {
        return toBlogPost(result.rows[0]);
      }

      attempt += 1;
    }

    return null;
  } catch {
    return null;
  }
}

export async function updatePost(id: number, input: BlogPostInput): Promise<BlogPost | null> {
  if (!db) {
    return null;
  }

  try {
    await ensurePostsSchema();

    const current = await db.query<{ id: number; slug: string }>(
      "SELECT id, slug FROM posts WHERE id = $1 LIMIT 1",
      [id]
    );

    if (current.rows.length === 0) {
      return null;
    }

    const currentSlug = current.rows[0].slug;
    const rootSlug = slugify(input.title);
    const targetSlug = currentSlug.startsWith(rootSlug) ? currentSlug : rootSlug;

    const result = await db.query<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      tags: string[];
      published_at: Date;
    }>(
      `UPDATE posts
       SET slug = $2,
           title = $3,
           excerpt = $4,
           content = $5,
           tags = $6
       WHERE id = $1
       RETURNING id, slug, title, excerpt, content, tags, published_at`,
      [id, targetSlug, input.title.trim(), normalizeExcerpt(input.excerpt, input.content), input.content.trim(), input.tags]
    );

    return result.rows.length > 0 ? toBlogPost(result.rows[0]) : null;
  } catch {
    return null;
  }
}

export async function deletePost(id: number): Promise<boolean> {
  if (!db) {
    return false;
  }

  try {
    await ensurePostsSchema();
    const result = await db.query("DELETE FROM posts WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  } catch {
    return false;
  }
}
