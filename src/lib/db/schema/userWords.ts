import { boolean, date, int, mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getUserWords } from "@/lib/api/userWords/queries";
import { getWordWithUserWords } from "@/lib/api/words/queries";


export const userWords = mysqlTable('user_words', {
  id: serial("id").primaryKey(),
  wordId: int("word_id").notNull(),
  attemptedAt: date("attempted_at").notNull(),
  success: boolean("success").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  level: int("level").notNull(),
});


// Schema for userWords - used to validate API requests
export const insertUserWordSchema = createInsertSchema(userWords);

export const insertUserWordParams = createSelectSchema(userWords, {
  wordId: z.coerce.number(),
  attemptedAt: z.coerce.date(),
  success: z.coerce.boolean(),
  level: z.coerce.number(),
}).omit({ 
  id: true,
  userId: true
});

export const updateUserWordSchema = createSelectSchema(userWords);

export const updateUserWordParams = createSelectSchema(userWords,{
  wordId: z.coerce.number(),
  attemptedAt: z.coerce.string(),
  success: z.coerce.boolean(),
  level: z.coerce.number(),
}).omit({ 
  userId: true
});

export const userWordIdSchema = updateUserWordSchema.pick({ id: true });

// Types for userWords - used to type API request params and within Components
export type UserWord = z.infer<typeof updateUserWordSchema>;
export type NewUserWord = z.infer<typeof insertUserWordSchema>;
export type NewUserWordParams = z.infer<typeof insertUserWordParams>;
export type UpdateUserWordParams = z.infer<typeof updateUserWordParams>;
export type UserWordId = z.infer<typeof userWordIdSchema>["id"];
    
// this type infers the return from getUserWords() - meaning it will include any joins
export type CompleteUserWord = Awaited<ReturnType<typeof getUserWords>>["userWords"][number];

export type WordWithUserWords = Awaited<ReturnType<typeof getWordWithUserWords>>["word"];