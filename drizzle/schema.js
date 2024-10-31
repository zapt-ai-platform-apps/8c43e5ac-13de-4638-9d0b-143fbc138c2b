import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const outlines = pgTable('outlines', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});