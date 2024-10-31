import { lessons } from '../drizzle/schema.js';
import { courses } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = await authenticateUser(req);
      const { courseId, title, content } = req.body;

      if (!courseId || !title || !content) {
        return res
          .status(400)
          .json({ error: 'Course ID, title, and content are required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      // Verify that the user owns the course
      const course = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId), eq(courses.userId, user.id)))
        .first();

      if (!course) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await db
        .insert(lessons)
        .values({
          courseId,
          title,
          content,
        })
        .returning();

      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error saving lesson:', error);
      res.status(500).json({ error: 'Error saving lesson' });
    }
  } else if (req.method === 'PUT') {
    try {
      const user = await authenticateUser(req);
      const { id, courseId, title, content } = req.body;

      if (!id || !courseId || !title || !content) {
        return res
          .status(400)
          .json({ error: 'ID, course ID, title, and content are required' });
      }

      const sql = neon(process.env.NEON_DB_URL);
      const db = drizzle(sql);

      // Verify that the user owns the course
      const course = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId), eq(courses.userId, user.id)))
        .first();

      if (!course) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await db
        .update(lessons)
        .set({ title, content })
        .where(eq(lessons.id, id))
        .returning();

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.status(500).json({ error: 'Error updating lesson' });
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

      // Verify that the user owns the lesson
      const lesson = await db
        .select()
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(and(eq(lessons.id, id), eq(courses.userId, user.id)))
        .first();

      if (!lesson) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await db.delete(lessons).where(eq(lessons.id, id));

      res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ error: 'Error deleting lesson' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}