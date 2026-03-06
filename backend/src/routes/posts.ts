import { Router } from 'express';
import { db } from '../db';
import { posts, tags, postTags } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { requireAuth, AuthRequest } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

// GET /posts — public, published only
router.get('/', async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt));

    const result = await Promise.all(
      rows.map(async (post) => {
        const postTagRows = await db
          .select({ name: tags.name, slug: tags.slug })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post.id));
        return { ...post, tags: postTagRows };
      })
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /posts/all — admin, all posts
router.get('/all', requireAuth, async (req: AuthRequest, res) => {
  try {
    const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
    const result = await Promise.all(
      rows.map(async (post) => {
        const postTagRows = await db
          .select({ name: tags.name, slug: tags.slug })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post.id));
        return { ...post, tags: postTagRows };
      })
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /posts/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [post] = await db.select().from(posts).where(eq(posts.slug, req.params.slug));
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (!post.published) return res.status(404).json({ error: 'Not found' });

    const postTagRows = await db
      .select({ name: tags.name, slug: tags.slug })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id));

    res.json({ ...post, tags: postTagRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /posts — create
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, excerpt, content, published, tagNames } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt,
        content,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        authorId: req.userId,
      })
      .returning();

    if (tagNames && tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        let [tag] = await db.select().from(tags).where(eq(tags.slug, tagSlug));
        if (!tag) {
          [tag] = await db.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
        }
        await db.insert(postTags).values({ postId: post.id, tagId: tag.id }).onConflictDoNothing();
      }
    }

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /posts/:id — update
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, excerpt, content, published, tagNames } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const [existing] = await db.select().from(posts).where(eq(posts.id, id));
    const wasPublished = existing?.published;

    const [post] = await db
      .update(posts)
      .set({
        title,
        slug,
        excerpt,
        content,
        published: published ?? false,
        publishedAt: published && !wasPublished ? new Date() : existing?.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    if (!post) return res.status(404).json({ error: 'Not found' });

    // Replace tags
    await db.delete(postTags).where(eq(postTags.postId, id));
    if (tagNames && tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        let [tag] = await db.select().from(tags).where(eq(tags.slug, tagSlug));
        if (!tag) {
          [tag] = await db.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
        }
        await db.insert(postTags).values({ postId: post.id, tagId: tag.id }).onConflictDoNothing();
      }
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /posts/:id
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(posts).where(eq(posts.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
