import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export async function postRoutes(app: FastifyInstance) {
  // GET /api/posts — list published posts
  app.get("/api/posts", async (_req, reply) => {
    const allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return reply.send(allPosts);
  });

  // GET /api/posts/:slug — single post by slug
  app.get<{ Params: { slug: string } }>("/api/posts/:slug", async (req, reply) => {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, req.params.slug))
      .limit(1);

    if (!post) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return reply.send(post);
  });

  // POST /api/posts — create a post
  app.post<{ Body: { title: string; slug: string; excerpt?: string; content: string; published?: boolean } }>(
    "/api/posts",
    async (req, reply) => {
      const { title, slug, excerpt, content, published } = req.body;

      const [newPost] = await db
        .insert(posts)
        .values({
          title,
          slug,
          excerpt: excerpt || "",
          content,
          published: published ?? false,
        })
        .returning();

      return reply.status(201).send(newPost);
    }
  );

  // PUT /api/posts/:id — update a post
  app.put<{
    Params: { id: string };
    Body: { title?: string; slug?: string; excerpt?: string; content?: string; published?: boolean };
  }>("/api/posts/:id", async (req, reply) => {
    const { title, slug, excerpt, content, published } = req.body;

    const [updated] = await db
      .update(posts)
      .set({
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published }),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, req.params.id))
      .returning();

    if (!updated) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return reply.send(updated);
  });

  // DELETE /api/posts/:id — delete a post
  app.delete<{ Params: { id: string } }>("/api/posts/:id", async (req, reply) => {
    const [deleted] = await db
      .delete(posts)
      .where(eq(posts.id, req.params.id))
      .returning();

    if (!deleted) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return reply.send({ ok: true });
  });
}
