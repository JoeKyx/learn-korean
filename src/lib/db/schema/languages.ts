import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getLanguages } from '@/lib/api/languages/queries';

export const languages = mysqlTable('languages', {
  id: serial('id').primaryKey(),
  language: varchar('language', { length: 256 }).notNull(),
  greeting: varchar('greeting', { length: 256 }).notNull(),
});

// Schema for languages - used to validate API requests
export const insertLanguageSchema = createInsertSchema(languages);

export const insertLanguageParams = createSelectSchema(languages, {}).omit({
  id: true,
});

export const updateLanguageSchema = createSelectSchema(languages);

export const updateLanguageParams = createSelectSchema(languages, {});

export const languageIdSchema = updateLanguageSchema.pick({ id: true });

// Types for languages - used to type API request params and within Components
export type Language = z.infer<typeof updateLanguageSchema>;
export type NewLanguage = z.infer<typeof insertLanguageSchema>;
export type NewLanguageParams = z.infer<typeof insertLanguageParams>;
export type UpdateLanguageParams = z.infer<typeof updateLanguageParams>;
export type LanguageId = z.infer<typeof languageIdSchema>['id'];

// this type infers the return from getLanguages() - meaning it will include any joins
export type CompleteLanguage = Awaited<
  ReturnType<typeof getLanguages>
>['languages'][number];
