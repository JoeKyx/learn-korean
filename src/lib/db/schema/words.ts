import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getWords } from '@/lib/api/words/queries';

export const words = mysqlTable('words', {
  id: serial('id').primaryKey(),
  wordEng: varchar('word_eng', { length: 256 }).notNull(),
  wordDe: varchar('word_de', { length: 256 }),
  pronunciation: varchar('pronunciation', { length: 256 }),
  wordKor: varchar('word_kor', { length: 256 }).notNull(),
  hint: varchar('hint', { length: 256 }),
  level: int('level').notNull(),
  lessonId: int('lesson_id').notNull(),
  userId: varchar('user_id', { length: 256 }),
});

// Schema for words - used to validate API requests
export const insertWordSchema = createInsertSchema(words);

export const insertWordParams = createSelectSchema(words, {
  level: z.coerce.number(),
  lessonId: z.coerce.number(),
}).omit({
  id: true,
});

export const updateWordSchema = createSelectSchema(words);

export const updateWordParams = createSelectSchema(words, {
  level: z.coerce.number(),
  lessonId: z.coerce.number(),
});

export const wordIdSchema = updateWordSchema.pick({ id: true });

// Types for words - used to type API request params and within Components
export type Word = z.infer<typeof updateWordSchema>;
export type NewWord = z.infer<typeof insertWordSchema>;
export type NewWordParams = z.infer<typeof insertWordParams>;
export type UpdateWordParams = z.infer<typeof updateWordParams>;
export type WordId = z.infer<typeof wordIdSchema>['id'];

// this type infers the return from getWords() - meaning it will include any joins
export type CompleteWord = Awaited<
  ReturnType<typeof getWords>
>['words'][number];
