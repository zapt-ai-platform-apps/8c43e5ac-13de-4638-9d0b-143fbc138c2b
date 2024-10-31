import { outlines } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as Sentry from '@sentry/node';
import { eq, desc } from 'drizzle-orm';

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
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db
      .select()
      .from(outlines)
      .orderBy(desc(outlines.createdAt))
      .limit(10);

    res.status(200).json(result);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching outlines:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}