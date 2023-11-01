import { date, int, mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getDatesStudies } from "@/lib/api/datesStudied/queries";


export const datesStudied = mysqlTable('dates_studied', {
  id: serial("id").primaryKey(),
  date: date("date", {mode: 'string'}).notNull(),
  attempts: int("attempts").notNull(),
  successful: int("successful").notNull(),
  failed: int("failed").notNull(),
  languageId: int("language_id").notNull(),
  lessonId: int("lesson_id").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
});


// Schema for datesStudied - used to validate API requests
export const insertDatesStudieSchema = createInsertSchema(datesStudied);

export const insertDatesStudieParams = createSelectSchema(datesStudied, {
  date: z.coerce.string(),
  attempts: z.coerce.number(),
  successful: z.coerce.number(),
  failed: z.coerce.number(),
  languageId: z.coerce.number(),
  lessonId: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateDatesStudieSchema = createSelectSchema(datesStudied);

export const updateDatesStudieParams = createSelectSchema(datesStudied,{
  date: z.coerce.string(),
  attempts: z.coerce.number(),
  successful: z.coerce.number(),
  failed: z.coerce.number(),
  languageId: z.coerce.number(),
  lessonId: z.coerce.number()
}).omit({ 
  userId: true
});

export const datesStudieIdSchema = updateDatesStudieSchema.pick({ id: true });

// Types for datesStudied - used to type API request params and within Components
export type DatesStudie = z.infer<typeof updateDatesStudieSchema>;
export type NewDatesStudie = z.infer<typeof insertDatesStudieSchema>;
export type NewDatesStudieParams = z.infer<typeof insertDatesStudieParams>;
export type UpdateDatesStudieParams = z.infer<typeof updateDatesStudieParams>;
export type DatesStudieId = z.infer<typeof datesStudieIdSchema>["id"];
    
// this type infers the return from getDatesStudied() - meaning it will include any joins
export type CompleteDatesStudie = Awaited<ReturnType<typeof getDatesStudies>>["datesStudied"][number];

