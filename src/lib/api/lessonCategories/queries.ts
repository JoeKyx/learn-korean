import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { type LessonCategorieId, lessonCategorieIdSchema, lessonCategories } from "@/lib/db/schema/lessonCategories";
import { lessons } from "@/lib/db/schema/lessons";

export const getLessonCategories = async () => {
  const l = await db.select().from(lessonCategories);
  return { lessonCategories: l };
};

export const getLessonCategorieById = async (id: LessonCategorieId) => {
  const { id: lessonCategorieId } = lessonCategorieIdSchema.parse({ id });
  const [l] = await db.select().from(lessonCategories).where(eq(lessonCategories.id, lessonCategorieId));
  return { lessonCategorie: l };
};

export const getAllLessonCategoryLanguageCombinations = async () => {
  const l = await db.select({categoryId: lessons.lessonCategoryId, languageId: lessons.languageId}).from(lessons).groupBy(lessons.lessonCategoryId, lessons.languageId);
  return l ;
};