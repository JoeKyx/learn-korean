import { createLessonCategorie, deleteLessonCategorie, updateLessonCategorie } from "@/lib/api/lessonCategories/mutations";
import { getLessonCategorieById, getLessonCategories } from "@/lib/api/lessonCategories/queries";
import {
  insertLessonCategorieParams,
  lessonCategorieIdSchema,
  updateLessonCategorieParams,
} from "@/lib/db/schema/lessonCategories";

import { publicProcedure, router } from "../trpc";

export const lessonCategoriesRouter = router({
  getLessonCategories: publicProcedure.query(async () => {
    return getLessonCategories();
  }),
  getLessonCategorieById: publicProcedure.input(lessonCategorieIdSchema).query(async ({ input }) => {
    return getLessonCategorieById(input.id);
  }),
  createLessonCategorie: publicProcedure
    .input(insertLessonCategorieParams)
    .mutation(async ({ input }) => {
      return createLessonCategorie(input);
    }),
  updateLessonCategorie: publicProcedure
    .input(updateLessonCategorieParams)
    .mutation(async ({ input }) => {
      return updateLessonCategorie(input.id, input);
    }),
  deleteLessonCategorie: publicProcedure
    .input(lessonCategorieIdSchema)
    .mutation(async ({ input }) => {
      return deleteLessonCategorie(input.id);
    }),
});
