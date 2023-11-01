import { getWordUserCategorieById, getWordUserCategories } from "@/lib/api/wordUserCategories/queries";
import { publicProcedure, router } from "../trpc";
import {
  wordUserCategorieIdSchema,
  insertWordUserCategorieParams,
  updateWordUserCategorieParams,
  deleteWordUserCategoryParams,
} from "@/lib/db/schema/wordUserCategories";
import { createWordUserCategorie, deleteWordUserCategorie, deleteWordUserCategoryByCategoryId, updateWordUserCategorie } from "@/lib/api/wordUserCategories/mutations";
import { wordCategorieIdSchema } from "@/lib/db/schema/wordCategories";
import logger from "@/lib/logger";

export const wordUserCategoriesRouter = router({
  getWordUserCategories: publicProcedure.query(async () => {
    return getWordUserCategories();
  }),
  getWordUserCategorieById: publicProcedure.input(wordUserCategorieIdSchema).query(async ({ input }) => {
    return getWordUserCategorieById(input.id);
  }),
  createWordUserCategorie: publicProcedure
    .input(insertWordUserCategorieParams)
    .mutation(async ({ input }) => {
      return createWordUserCategorie(input);
    }),
  updateWordUserCategorie: publicProcedure
    .input(updateWordUserCategorieParams)
    .mutation(async ({ input }) => {
      return updateWordUserCategorie(input.id, input);
    }),
  deleteWordUserCategorie: publicProcedure
    .input(wordUserCategorieIdSchema)
    .mutation(async ({ input }) => {
      return deleteWordUserCategorie(input.id);
    }),
  deleteWordUserCategoryByCategoryId: publicProcedure
    .input(deleteWordUserCategoryParams)
    .mutation(async ({ input }) => {
      logger(input, 'in Mutation Router')
      return deleteWordUserCategoryByCategoryId(input);
    }),
});
