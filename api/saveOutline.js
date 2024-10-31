import { outlines } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as Sentry from '@sentry/node';
import { eq } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.APP_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    if (req.method === 'POST') {
      const { title, description, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const [result] = await db
        .insert(outlines)
        .values({
          title,
          description,
          content,
        })
        .returning();

      res.status(201).json(result);
    } else if (req.method === 'PUT') {
      const { id, title, description, content } = req.body;

      if (!id || !title || !content) {
        return res.status(400).json({ error: 'ID, title, and content are required' });
      }

      const [result] = await db
        .update(outlines)
        .set({ title, description, content })
        .where(eq(outlines.id, id))
        .returning();

      res.status(200).json(result);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await db.delete(outlines).where(eq(outlines.id, id));

      res.status(200).json({ message: 'Outline deleted successfully' });
    } else {
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error handling outline:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}