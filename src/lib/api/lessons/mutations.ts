import { and, eq } from "drizzle-orm";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { 
  insertLessonSchema, 
  LessonId, 
  lessonIdSchema, 
  lessons,
  NewLessonParams,
  UpdateLessonParams, 
  updateLessonSchema} from "@/lib/db/schema/lessons";
import logger from "@/lib/logger";

export const createLesson = async (lesson: NewLessonParams) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  if(session.user.id !== lesson.userId) throw new Error("You can only create lessons for yourself");
  const newLesson = insertLessonSchema.parse(lesson);
  try {
    await db.insert(lessons).values(newLesson)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    logger(message);
    return { error: message };
  }
};

export const updateLesson = async (id: LessonId, lesson: UpdateLessonParams) => {
  console.log("Testing") 
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  const { id: lessonId } = lessonIdSchema.parse( {id} );
  const newLesson = updateLessonSchema.parse(lesson);
  logger(newLesson, "newLesson")
  try {
    if(!lessonId) throw Error("Lesson ID is required")
    await db
     .update(lessons)
     .set(newLesson)
     .where(and(eq(lessons.id, lessonId), eq(lessons.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    logger(message);
    return { error: message };
  }
};

export const deleteLesson = async (id: LessonId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  const { id: lessonId } = lessonIdSchema.parse({ id });
  try {
    await db.delete(lessons).where(and(eq(lessons.id, lessonId), eq(lessons.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    logger(message);
    return { error: message };
  }
};

