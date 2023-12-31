import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  insertLessonCategorieSchema,
  LessonCategorieId,
  lessonCategorieIdSchema,
  lessonCategories,
  NewLessonCategorieParams,
  UpdateLessonCategorieParams,
  updateLessonCategorieSchema,
} from '@/lib/db/schema/lessonCategories';

export const createLessonCategorie = async (
  lessonCategorie: NewLessonCategorieParams
) => {
  const newLessonCategorie = insertLessonCategorieSchema.parse(lessonCategorie);
  try {
    await db.insert(lessonCategories).values(newLessonCategorie);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateLessonCategorie = async (
  id: LessonCategorieId,
  lessonCategorie: UpdateLessonCategorieParams
) => {
  const { id: lessonCategorieId } = lessonCategorieIdSchema.parse({ id });
  const newLessonCategorie = updateLessonCategorieSchema.parse(lessonCategorie);
  try {
    await db
      .update(lessonCategories)
      .set(newLessonCategorie)
      .where(eq(lessonCategories.id, lessonCategorieId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteLessonCategorie = async (id: LessonCategorieId) => {
  const { id: lessonCategorieId } = lessonCategorieIdSchema.parse({ id });
  try {
    await db
      .delete(lessonCategories)
      .where(eq(lessonCategories.id, lessonCategorieId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
