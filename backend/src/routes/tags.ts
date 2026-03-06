import { Router, Response } from 'express';
import { db } from '../db/client.js';
import { tags } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all tags
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const allTags = await db.query.tags.findMany();
    res.json(allTags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create tag (authenticated)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTag = await db
      .insert(tags)
      .values({
        name,
        slug,
      })
      .returning();

    res.status(201).json(newTag[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tag (authenticated)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await db.delete(tags).where(eq(tags.id, parseInt(id)));

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
