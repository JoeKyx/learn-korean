import { getWordCategorieById, getWordCategories } from "@/lib/api/wordCategories/queries";
import { publicProcedure, router } from "../trpc";
import {
  wordCategorieIdSchema,
  insertWordCategorieParams,
  updateWordCategorieParams,
} from "@/lib/db/schema/wordCategories";
import { createWordCategorie, deleteWordCategorie, updateWordCategorie } from "@/lib/api/wordCategories/mutations";

export const wordCategoriesRouter = router({
  getWordCategories: publicProcedure.query(async () => {
    return getWordCategories();
  }),
  getWordCategorieById: publicProcedure.input(wordCategorieIdSchema).query(async ({ input }) => {
    return getWordCategorieById(input.id);
  }),
  createWordCategorie: publicProcedure
    .input(insertWordCategorieParams)
    .mutation(async ({ input }) => {
      return createWordCategorie(input);
    }),
  updateWordCategorie: publicProcedure
    .input(updateWordCategorieParams)
    .mutation(async ({ input }) => {
      return updateWordCategorie(input.id, input);
    }),
  deleteWordCategorie: publicProcedure
    .input(wordCategorieIdSchema)
    .mutation(async ({ input }) => {
      return deleteWordCategorie(input.id);
    }),
});
