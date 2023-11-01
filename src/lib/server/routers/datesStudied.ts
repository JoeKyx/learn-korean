import { getDatesStudieById, getDatesStudies, getDatesStudiedByLanguage } from "@/lib/api/datesStudied/queries";
import { publicProcedure, router } from "../trpc";
import {
  datesStudieIdSchema,
  insertDatesStudieParams,
  updateDatesStudieParams,
} from "@/lib/db/schema/datesStudied";
import { createDatesStudie, deleteDatesStudie, updateDatesStudie } from "@/lib/api/datesStudied/mutations";
import { languageIdSchema } from "@/lib/db/schema/languages";

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
