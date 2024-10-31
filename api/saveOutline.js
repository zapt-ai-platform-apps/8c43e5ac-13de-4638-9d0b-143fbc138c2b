import { outlines } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      const result = await db.insert(outlines).values({
        title,
        description,
        content,
      }).returning();

      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error saving outline:', error);
      res.status(500).json({ error: 'Error saving outline' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, content } = req.body;

      if (!id || !title || !content) {
        return res.status(400).json({ error: 'ID, title, and content are required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      const result = await db.update(outlines)
        .set({ title, description, content })
        .where(outlines.id.eq(id))
        .returning();

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error updating outline:', error);
      res.status(500).json({ error: 'Error updating outline' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      await db.deleteFrom(outlines).where(outlines.id.eq(id));

      res.status(200).json({ message: 'Outline deleted successfully' });
    } catch (error) {
      console.error('Error deleting outline:', error);
      res.status(500).json({ error: 'Error deleting outline' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}