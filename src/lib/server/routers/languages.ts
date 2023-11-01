import { createLanguage, deleteLanguage, updateLanguage } from "@/lib/api/languages/mutations";
import { getLanguageById, getLanguages } from "@/lib/api/languages/queries";
import {
  insertLanguageParams,
  languageIdSchema,
  updateLanguageParams,
} from "@/lib/db/schema/languages";

import { publicProcedure, router } from "../trpc";

export const languagesRouter = router({
  getLanguages: publicProcedure.query(async () => {
    return getLanguages();
  }),
  getLanguageById: publicProcedure.input(languageIdSchema).query(async ({ input }) => {
    return getLanguageById(input.id);
  }),
  createLanguage: publicProcedure
    .input(insertLanguageParams)
    .mutation(async ({ input }) => {
      return createLanguage(input);
    }),
  updateLanguage: publicProcedure
    .input(updateLanguageParams)
    .mutation(async ({ input }) => {
      return updateLanguage(input.id, input);
    }),
  deleteLanguage: publicProcedure
    .input(languageIdSchema)
    .mutation(async ({ input }) => {
      return deleteLanguage(input.id);
    }),
});
