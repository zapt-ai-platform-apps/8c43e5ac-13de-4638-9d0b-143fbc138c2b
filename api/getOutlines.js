import { outlines } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.select().from(outlines).orderBy(outlines.createdAt.desc()).limit(10);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching outlines:', error);
    res.status(500).json({ error: 'Error fetching outlines' });
  }
}