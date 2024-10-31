import { courses } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = await authenticateUser(req);
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      const result = await db
        .insert(courses)
        .values({
          title,
          description,
          userId: user.id,
        })
        .returning();

      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error saving course:', error);
      res.status(500).json({ error: 'Error saving course' });
    }
  } else if (req.method === 'PUT') {
    try {
      const user = await authenticateUser(req);
      const { id, title, description } = req.body;

      if (!id || !title) {
        return res.status(400).json({ error: 'ID and title are required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      const result = await db
        .update(courses)
        .set({ title, description })
        .where(and(eq(courses.id, id), eq(courses.userId, user.id)))
        .returning();

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Error updating course' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const user = await authenticateUser(req);
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      await db
        .delete(courses)
        .where(and(eq(courses.id, id), eq(courses.userId, user.id)));

      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Error deleting course' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}