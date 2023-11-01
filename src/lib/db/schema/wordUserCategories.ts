import { int, mysqlTable,serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getWordUserCategories } from "@/lib/api/wordUserCategories/queries";

export const wordUserCategories = mysqlTable('word_user_categories', {
  id: serial("id").primaryKey(),
  wordId: int("word_id").notNull(),
  wordcategorieId: int("wordCategorie_id").notNull(),
  addedAt: timestamp("added_at").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
});


// Schema for wordUserCategories - used to validate API requests
export const insertWordUserCategorieSchema = createInsertSchema(wordUserCategories);

export const insertWordUserCategorieParams = createSelectSchema(wordUserCategories, {
  wordId: z.coerce.number(),
  wordcategorieId: z.coerce.number(),
  addedAt: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateWordUserCategorieSchema = createSelectSchema(wordUserCategories);

export const updateWordUserCategorieParams = createSelectSchema(wordUserCategories,{
  wordId: z.coerce.number(),
  wordcategorieId: z.coerce.number(),
  addedAt: z.coerce.date()
}).omit({ 
  userId: true
});

export const deleteWordUserCategoryParams = createSelectSchema(wordUserCategories,{
  wordId: z.coerce.number(),
  wordcategorieId: z.coerce.number()
}).omit({ 
  userId: true,
  addedAt: true,
  id:true 
});

export const wordUserCategorieIdSchema = updateWordUserCategorieSchema.pick({ id: true });

// Types for wordUserCategories - used to type API request params and within Components
export type WordUserCategorie = z.infer<typeof updateWordUserCategorieSchema>;
export type NewWordUserCategorie = z.infer<typeof insertWordUserCategorieSchema>;
export type NewWordUserCategorieParams = z.infer<typeof insertWordUserCategorieParams>;
export type UpdateWordUserCategorieParams = z.infer<typeof updateWordUserCategorieParams>;
export type WordUserCategorieId = z.infer<typeof wordUserCategorieIdSchema>["id"];
    
// this type infers the return from getWordUserCategories() - meaning it will include any joins
export type CompleteWordUserCategorie = Awaited<ReturnType<typeof getWordUserCategories>>["wordUserCategories"][number];

