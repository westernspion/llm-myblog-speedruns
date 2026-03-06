import { Router } from 'express';
import { db } from '../db';
import { tags } from '../db/schema';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const all = await db.select().from(tags);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
