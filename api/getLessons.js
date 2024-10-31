import { lessons } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.createdAt.desc());

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Error fetching lessons' });
  }
}