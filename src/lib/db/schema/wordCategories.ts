import { mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getWordCategories } from "@/lib/api/wordCategories/queries";

export const wordCategories = mysqlTable('word_categories', {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  icon: varchar("icon", { length: 256 }).notNull(),
  color: varchar("color", { length: 256 }).notNull(),
});


// Schema for wordCategories - used to validate API requests
export const insertWordCategorieSchema = createInsertSchema(wordCategories);

export const insertWordCategorieParams = createSelectSchema(wordCategories, {}).omit({ 
  id: true
});

export const updateWordCategorieSchema = createSelectSchema(wordCategories);

export const updateWordCategorieParams = createSelectSchema(wordCategories,{})

export const wordCategorieIdSchema = updateWordCategorieSchema.pick({ id: true });


// Types for wordCategories - used to type API request params and within Components
export type WordCategorie = z.infer<typeof updateWordCategorieSchema>;
export type NewWordCategorie = z.infer<typeof insertWordCategorieSchema>;
export type NewWordCategorieParams = z.infer<typeof insertWordCategorieParams>;
export type UpdateWordCategorieParams = z.infer<typeof updateWordCategorieParams>;
export type WordCategorieId = z.infer<typeof wordCategorieIdSchema>["id"];
    
// this type infers the return from getWordCategories() - meaning it will include any joins
export type CompleteWordCategorie = Awaited<ReturnType<typeof getWordCategories>>["wordCategories"][number];

