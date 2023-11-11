import {
  createUserCard,
  deleteUserCard,
  updateUserCard,
} from '@/lib/api/userCards/mutations';
import { getUserCardById, getUserCards } from '@/lib/api/userCards/queries';
import {
  insertUserCardParams,
  updateUserCardParams,
  userCardIdSchema,
} from '@/lib/db/schema/userCards';

import { publicProcedure, router } from '../trpc';

export const userCardsRouter = router({
  getUserCards: publicProcedure.query(async () => {
    return getUserCards();
  }),
  getUserCardById: publicProcedure
    .input(userCardIdSchema)
    .query(async ({ input }) => {
      return getUserCardById(input.id);
    }),
  createUserCard: publicProcedure
    .input(insertUserCardParams)
    .mutation(async ({ input }) => {
      return createUserCard(input);
    }),
  updateUserCard: publicProcedure
    .input(updateUserCardParams)
    .mutation(async ({ input }) => {
      return updateUserCard(input.id, input);
    }),
  deleteUserCard: publicProcedure
    .input(userCardIdSchema)
    .mutation(async ({ input }) => {
      return deleteUserCard(input.id);
    }),
});
