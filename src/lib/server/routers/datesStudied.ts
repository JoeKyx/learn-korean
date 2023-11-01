import { createDatesStudie, deleteDatesStudie, updateDatesStudie } from "@/lib/api/datesStudied/mutations";
import { getDatesStudieById, getDatesStudiedByLanguage,getDatesStudies } from "@/lib/api/datesStudied/queries";
import {
  datesStudieIdSchema,
  insertDatesStudieParams,
  updateDatesStudieParams,
} from "@/lib/db/schema/datesStudied";
import { languageIdSchema } from "@/lib/db/schema/languages";

import { publicProcedure, router } from "../trpc";

export const datesStudiedRouter = router({
  getDatesStudied: publicProcedure.query(async () => {
    return getDatesStudies();
  }),
  getDatesStudieById: publicProcedure.input(datesStudieIdSchema).query(async ({ input }) => {
    return getDatesStudieById(input.id);
  }),
  createDatesStudie: publicProcedure
    .input(insertDatesStudieParams)
    .mutation(async ({ input }) => {
      return createDatesStudie(input);
    }),
  updateDatesStudie: publicProcedure
    .input(updateDatesStudieParams)
    .mutation(async ({ input }) => {
      return updateDatesStudie(input.id, input);
    }),
  deleteDatesStudie: publicProcedure
    .input(datesStudieIdSchema)
    .mutation(async ({ input }) => {
      return deleteDatesStudie(input.id);
    }),
  getDatesStudiedByLanguage: publicProcedure
    .input(languageIdSchema)
    .query(async ({ input }) => {
      return getDatesStudiedByLanguage(input.id);
    }),
});
