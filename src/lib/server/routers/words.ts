import { createWord, deleteWord, updateWord } from '@/lib/api/words/mutations';
import { getWordById, getWords } from '@/lib/api/words/queries';
import {
  insertWordParams,
  updateWordParams,
  wordIdSchema,
} from '@/lib/db/schema/words';

import { publicProcedure, router } from '../trpc';

export const wordsRouter = router({
  getWords: publicProcedure.query(async () => {
    return getWords();
  }),
  getWordById: publicProcedure.input(wordIdSchema).query(async ({ input }) => {
    return getWordById(input.id);
  }),
  createWord: publicProcedure
    .input(insertWordParams)
    .mutation(async ({ input }) => {
      return createWord(input);
    }),
  updateWord: publicProcedure
    .input(updateWordParams)
    .mutation(async ({ input }) => {
      return updateWord(input.id, input);
    }),
  deleteWord: publicProcedure
    .input(wordIdSchema)
    .mutation(async ({ input }) => {
      return deleteWord(input.id);
    }),
});
