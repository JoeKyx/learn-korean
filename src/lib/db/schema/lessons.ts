import { int, mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getLessons, getLessonsWithCategory, getPracticeLessons } from "@/lib/api/lessons/queries";
import { getDatesStudiedByLanguage } from "@/lib/api/datesStudied/queries";

export const lessons = mysqlTable('lessons', {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  level: int("level").notNull(),
  lessonNumber: int("lesson_number").notNull(),
  link: varchar("link", { length: 256 }),
  languageId: int("language_id").notNull(),
  userId: varchar("user_id", { length: 256 }),
  lessonCategoryId: int("lesson_category_id").notNull(),
});


// Schema for lessons - used to validate API requests
export const insertLessonSchema = createInsertSchema(lessons);

export const USER_LESSON_ID = 0;

export const insertLessonParams = createSelectSchema(lessons, {
  level: z.coerce.number(),
  lessonNumber: z.coerce.number(),
}).omit({ 
  id: true
});

export const updateLessonSchema = createSelectSchema(lessons);

export const updateLessonParams = createSelectSchema(lessons,{
  level: z.coerce.number()
})

export const lessonIdSchema = updateLessonSchema.pick({ id: true });

// Types for lessons - used to type API request params and within Components
export type Lesson = z.infer<typeof updateLessonSchema>;
export type NewLesson = z.infer<typeof insertLessonSchema>;
export type NewLessonParams = z.infer<typeof insertLessonParams>;
export type UpdateLessonParams = z.infer<typeof updateLessonParams>;
export type LessonId = z.infer<typeof lessonIdSchema>["id"];
    
// this type infers the return from getLessons() - meaning it will include any joins
export type CompleteLesson = Awaited<ReturnType<typeof getLessons>>["lessons"][number];
export type LessonWithCategory = Awaited<ReturnType<typeof getLessonsWithCategory>>["categories"];
export type PracticeLesson = Awaited<ReturnType<typeof getPracticeLessons>>["lesson"];
export type DatesStudied = Awaited<ReturnType<typeof getDatesStudiedByLanguage>>["datesStudied"];
export type PracticeWords = PracticeLesson["words"];
export type PracticeWord = PracticeWords[number];