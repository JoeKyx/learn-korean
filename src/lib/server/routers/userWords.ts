import { createUserWord, deleteUserWord, updateUserWord } from "@/lib/api/userWords/mutations";
import { getAmountOfWordsPractied,getUserWordById, getUserWords } from "@/lib/api/userWords/queries";
import { languageIdSchema } from "@/lib/db/schema/languages";
import {
  insertUserWordParams,
  updateUserWordParams,
  userWordIdSchema,
} from "@/lib/db/schema/userWords";

import { publicProcedure, router } from "../trpc";

export const userWordsRouter = router({
  getUserWords: publicProcedure.query(async () => {
    return getUserWords();
  }),
  getUserWordById: publicProcedure.input(userWordIdSchema).query(async ({ input }) => {
    return getUserWordById(input.id);
  }),
  createUserWord: publicProcedure
    .input(insertUserWordParams)
    .mutation(async ({ input }) => {
      return createUserWord(input);
    }),
  updateUserWord: publicProcedure
    .input(updateUserWordParams)
    .mutation(async ({ input }) => {
      return updateUserWord(input.id, input);
    }),
  deleteUserWord: publicProcedure
    .input(userWordIdSchema)
    .mutation(async ({ input }) => {
      return deleteUserWord(input.id);
    }),
    getAmountOfWordsPracticed: publicProcedure.input(languageIdSchema).query(async ({input}) => {
      return getAmountOfWordsPractied(input.id);
    
    })
});
