import { lessons, courses } from '../drizzle/schema.js';
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
      const { courseId, title, content } = req.body;

      if (!courseId || !title || !content) {
        return res
          .status(400)
          .json({ error: 'Course ID, title, and content are required' });
      }

      // Verify that the user owns the course
      const course = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId), eq(courses.userId, user.id)))
        .limit(1);

      if (course.length === 0) {
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
    } else if (req.method === 'PUT') {
      const { id, courseId, title, content } = req.body;

      if (!id || !courseId || !title || !content) {
        return res
          .status(400)
          .json({ error: 'ID, course ID, title, and content are required' });
      }

      // Verify that the user owns the course
      const course = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId), eq(courses.userId, user.id)))
        .limit(1);

      if (course.length === 0) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await db
        .update(lessons)
        .set({ title, content })
        .where(eq(lessons.id, id))
        .returning();

      res.status(200).json(result[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      // Verify that the user owns the lesson
      const lesson = await db
        .select()
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(and(eq(lessons.id, id), eq(courses.userId, user.id)))
        .limit(1);

      if (lesson.length === 0) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await db.delete(lessons).where(eq(lessons.id, id));

      res.status(200).json({ message: 'Lesson deleted successfully' });
    } else {
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error handling lesson:', error);
    res.status(500).json({ error: 'Error handling lesson' });
  }
}