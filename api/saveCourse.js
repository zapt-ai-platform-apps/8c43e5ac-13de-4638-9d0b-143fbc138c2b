import { courses } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as Sentry from '@sentry/node';
import { eq, and } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    if (req.method === 'POST') {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const result = await db
        .insert(courses)
        .values({
          title,
          description,
          userId: user.id,
        })
        .returning();

      res.status(201).json(result[0]);
    } else if (req.method === 'PUT') {
      const { id, title, description } = req.body;

      if (!id || !title) {
        return res.status(400).json({ error: 'ID and title are required' });
      }

      const result = await db
        .update(courses)
        .set({ title, description })
        .where(and(eq(courses.id, id), eq(courses.userId, user.id)))
        .returning();

      res.status(200).json(result[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await db
        .delete(courses)
        .where(and(eq(courses.id, id), eq(courses.userId, user.id)));

      res.status(200).json({ message: 'Course deleted successfully' });
    } else {
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error handling course:', error);
    res.status(500).json({ error: 'Error handling course' });
  }
}