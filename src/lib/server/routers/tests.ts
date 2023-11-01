import { getTestById, getTests } from "@/lib/api/tests/queries";
import { publicProcedure, router } from "../trpc";
import {
  testIdSchema,
  insertTestParams,
  updateTestParams,
} from "@/lib/db/schema/tests";
import { createTest, deleteTest, updateTest } from "@/lib/api/tests/mutations";

export const testsRouter = router({
  getTests: publicProcedure.query(async () => {
    return getTests();
  }),
  getTestById: publicProcedure.input(testIdSchema).query(async ({ input }) => {
    return getTestById(input.id);
  }),
  createTest: publicProcedure
    .input(insertTestParams)
    .mutation(async ({ input }) => {
      return createTest(input);
    }),
  updateTest: publicProcedure
    .input(updateTestParams)
    .mutation(async ({ input }) => {
      return updateTest(input.id, input);
    }),
  deleteTest: publicProcedure
    .input(testIdSchema)
    .mutation(async ({ input }) => {
      return deleteTest(input.id);
    }),
});
