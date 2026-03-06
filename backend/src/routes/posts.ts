import { Router, Response } from 'express';
import { db } from '../db/client.js';
import { posts, postTags, tags } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all published posts
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const allPosts = await db.query.posts.findMany({
      where: eq(posts.published, true),
      with: {
        author: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    res.json(allPosts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post by slug
router.get('/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        author: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await db
      .update(posts)
      .set({ viewCount: post.viewCount + 1 })
      .where(eq(posts.id, post.id));

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create post (authenticated)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, content, excerpt, tagIds } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        authorId: req.userId!,
        published: false,
      })
      .returning();

    // Add tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      for (const tagId of tagIds) {
        await db.insert(postTags).values({
          postId: newPost[0].id,
          tagId,
        });
      }
    }

    res.status(201).json(newPost[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update post (authenticated)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, published, tagIds } = req.body;

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(id)),
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedPost = await db
      .update(posts)
      .set({
        title: title || post.title,
        slug: slug || post.slug,
        content: content || post.content,
        excerpt: excerpt !== undefined ? excerpt : post.excerpt,
        published: published !== undefined ? published : post.published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, parseInt(id)))
      .returning();

    // Update tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      await db.delete(postTags).where(eq(postTags.postId, parseInt(id)));
      for (const tagId of tagIds) {
        await db.insert(postTags).values({
          postId: parseInt(id),
          tagId,
        });
      }
    }

    res.json(updatedPost[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post (authenticated)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(id)),
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.delete(postTags).where(eq(postTags.postId, parseInt(id)));
    await db.delete(posts).where(eq(posts.id, parseInt(id)));

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
