import { createTests, deleteTests, updateTests } from "@/lib/api/tests2/mutations";
import { getTests2,getTestsById } from "@/lib/api/tests2/queries";
import {
  insertTestsParams,
  testsIdSchema,
  updateTestsParams,
} from "@/lib/db/schema/tests2";

import { publicProcedure, router } from "../trpc";

export const tests2Router = router({
  getTests2: publicProcedure.query(async () => {
    return getTests2();
  }),
  getTestsById: publicProcedure.input(testsIdSchema).query(async ({ input }) => {
    return getTestsById(input.id);
  }),
  createTests: publicProcedure
    .input(insertTestsParams)
    .mutation(async ({ input }) => {
      return createTests(input);
    }),
  updateTests: publicProcedure
    .input(updateTestsParams)
    .mutation(async ({ input }) => {
      return updateTests(input.id, input);
    }),
  deleteTests: publicProcedure
    .input(testsIdSchema)
    .mutation(async ({ input }) => {
      return deleteTests(input.id);
    }),
});
