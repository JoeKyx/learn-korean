import { getLessonCategorieById, getLessonCategories } from "@/lib/api/lessonCategories/queries";
import { publicProcedure, router } from "../trpc";
import {
  lessonCategorieIdSchema,
  insertLessonCategorieParams,
  updateLessonCategorieParams,
} from "@/lib/db/schema/lessonCategories";
import { createLessonCategorie, deleteLessonCategorie, updateLessonCategorie } from "@/lib/api/lessonCategories/mutations";

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
