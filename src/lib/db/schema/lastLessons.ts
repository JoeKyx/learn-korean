import {
  datetime,
  int,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getLastLessons } from '@/lib/api/lastLessons/queries';

export const lastLessons = mysqlTable('last_lessons', {
  id: serial('id').primaryKey(),
  lessonId: int('lesson_id').notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  createdAt: datetime('created_at').notNull(),
});

// Schema for lastLessons - used to validate API requests
export const insertLastLessonSchema = createInsertSchema(lastLessons);

export const insertLastLessonParams = createSelectSchema(lastLessons, {
  lessonId: z.coerce.number(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const updateLastLessonSchema = createSelectSchema(lastLessons);

export const updateLastLessonParams = createSelectSchema(lastLessons, {
  lessonId: z.coerce.number(),
  createdAt: z.coerce.date(),
}).omit({
  userId: true,
});

export const lastLessonIdSchema = updateLastLessonSchema.pick({ id: true });

// Types for lastLessons - used to type API request params and within Components
export type LastLesson = z.infer<typeof updateLastLessonSchema>;
export type NewLastLesson = z.infer<typeof insertLastLessonSchema>;
export type NewLastLessonParams = z.infer<typeof insertLastLessonParams>;
export type UpdateLastLessonParams = z.infer<typeof updateLastLessonParams>;
export type LastLessonId = z.infer<typeof lastLessonIdSchema>['id'];

// this type infers the return from getLastLessons() - meaning it will include any joins
export type CompleteLastLesson = Awaited<
  ReturnType<typeof getLastLessons>
>['lastLessons'][number];
