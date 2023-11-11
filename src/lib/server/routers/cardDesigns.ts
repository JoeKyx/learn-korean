import {
  createCardDesign,
  deleteCardDesign,
  updateCardDesign,
} from '@/lib/api/cardDesigns/mutations';
import {
  getCardDesignById,
  getCardDesigns,
} from '@/lib/api/cardDesigns/queries';
import {
  cardDesignIdSchema,
  insertCardDesignParams,
  updateCardDesignParams,
} from '@/lib/db/schema/cardDesigns';

import { publicProcedure, router } from '../trpc';

export const cardDesignsRouter = router({
  getCardDesigns: publicProcedure.query(async () => {
    return getCardDesigns();
  }),
  getCardDesignById: publicProcedure
    .input(cardDesignIdSchema)
    .query(async ({ input }) => {
      return getCardDesignById(input.id);
    }),
  createCardDesign: publicProcedure
    .input(insertCardDesignParams)
    .mutation(async ({ input }) => {
      return createCardDesign(input);
    }),
  updateCardDesign: publicProcedure
    .input(updateCardDesignParams)
    .mutation(async ({ input }) => {
      return updateCardDesign(input.id, input);
    }),
  deleteCardDesign: publicProcedure
    .input(cardDesignIdSchema)
    .mutation(async ({ input }) => {
      return deleteCardDesign(input.id);
    }),
});
