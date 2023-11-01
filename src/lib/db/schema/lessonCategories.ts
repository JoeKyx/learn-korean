import { mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getLessonCategories } from "@/lib/api/lessonCategories/queries";

export const lessonCategories = mysqlTable('lesson_categories', {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  image: varchar("image", { length: 256 }),
});


// Schema for lessonCategories - used to validate API requests
export const insertLessonCategorieSchema = createInsertSchema(lessonCategories);

export const insertLessonCategorieParams = createSelectSchema(lessonCategories, {}).omit({ 
  id: true
});

export const updateLessonCategorieSchema = createSelectSchema(lessonCategories);

export const updateLessonCategorieParams = createSelectSchema(lessonCategories,{})

export const lessonCategorieIdSchema = updateLessonCategorieSchema.pick({ id: true });

// Types for lessonCategories - used to type API request params and within Components
export type LessonCategorie = z.infer<typeof updateLessonCategorieSchema>;
export type NewLessonCategorie = z.infer<typeof insertLessonCategorieSchema>;
export type NewLessonCategorieParams = z.infer<typeof insertLessonCategorieParams>;
export type UpdateLessonCategorieParams = z.infer<typeof updateLessonCategorieParams>;
export type LessonCategorieId = z.infer<typeof lessonCategorieIdSchema>["id"];
    
// this type infers the return from getLessonCategories() - meaning it will include any joins
export type CompleteLessonCategorie = Awaited<ReturnType<typeof getLessonCategories>>["lessonCategories"][number];

